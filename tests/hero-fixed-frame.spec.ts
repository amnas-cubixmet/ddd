import { expect, test } from "@playwright/test";

test("capture final fixed streetlight frames and check responsive layout", async ({ browser }) => {
  test.setTimeout(150_000);
  for (const profile of [{name:"mobile",width:390,height:844,ratio:31/50},{name:"wide",width:1440,height:900,ratio:6/5}]) {
    const context = await browser.newContext({ viewport: {width:profile.width,height:profile.height}, reducedMotion:"reduce", deviceScaleFactor: 1 });
    try {
      await context.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, options?: unknown) {
          return Reflect.apply(original, this, [type, /^webgl/.test(type) ? {...(options as object),preserveDrawingBuffer:true} : options]);
        } as typeof original;
      });
      const page = await context.newPage();
      await page.goto("/");
      const stage = page.getByTestId("streetlight-stage");
      await expect(stage).toHaveAttribute("data-ready","true",{timeout:60_000});
      await page.evaluate(() => document.fonts.ready);
      const capture = await stage.evaluate(el => {
        const canvas = el.querySelector("canvas")!;
        const copy = document.createElement("canvas");
        copy.width=canvas.width; copy.height=canvas.height;
        const ctx=copy.getContext("2d")!;
        ctx.drawImage(canvas,0,0);
        const rgba=ctx.getImageData(0,0,copy.width,copy.height).data;
        let pixels=0;
        for(let i=3;i<rgba.length;i+=4) if(rgba[i]>24) pixels++;
        const glow=el.querySelector<HTMLElement>("[style*='--lens-x']");
        const rect=el.getBoundingClientRect();
        return { image:copy.toDataURL("image/webp",0.93).split(",")[1], ratio:rect.width/rect.height, visible:pixels/(copy.width*copy.height), x:glow?.style.getPropertyValue("--lens-x"), y:glow?.style.getPropertyValue("--lens-y") };
      });
      expect(Math.abs(capture.ratio-profile.ratio)).toBeLessThan(0.025);
      expect(capture.visible).toBeGreaterThan(0.005);
      // CI log chunks let the reviewed capture be retrieved without manual local scripts.
      console.log("HERO_POSTER_META "+profile.name+" "+JSON.stringify({x:capture.x,y:capture.y,length:capture.image.length}));
      for(let offset=0;offset<capture.image.length;offset+=1600) console.log("HERO_POSTER_CHUNK "+profile.name+" "+offset+" "+capture.image.slice(offset,offset+1600));
      const before=await stage.boundingBox();
      await page.waitForTimeout(600);
      const after=await stage.boundingBox();
      expect(after).toEqual(before);
    } finally { await context.close(); }
  }
});

for(const width of [320,390,768,1440]) {
  test(`hero stage reserves fixed geometry at ${width}px`,async ({browser})=>{
    const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false});
    try {
      const page=await context.newPage(); await page.goto("/");
      const stage=page.getByTestId("streetlight-stage");
      const box=await stage.boundingBox(); expect(box).not.toBeNull();
      expect(Math.abs(box!.width/box!.height-(width<=650?31/50:6/5))).toBeLessThan(.025);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    } finally {await context.close();}
  });
}
