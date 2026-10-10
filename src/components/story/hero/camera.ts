/**
 * Camera primitives for the cinematic hero.
 *
 * A camera is `{ x, y, z }`: the normalised image point held at the centre of
 * the view, and a zoom where 1 = the image just covering the view. Placement
 * is always clamped so an image never exposes its edges — a real lens can't
 * see past the set.
 */

export type Frame = { width: number; height: number };
export type Drawable = CanvasImageSource & Frame;
export type Cam = { x: number; y: number; z: number };
export type View = { w: number; h: number };
export type Placement = { s: number; dx: number; dy: number };

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Symmetric ease for camera travel: gentle start and stop, linear middle. */
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) * 0.55 + t * 0.45;

export const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  // Zoom is interpolated geometrically so it reads as constant speed.
  z: a.z * Math.pow(b.z / a.z, t),
});

export function coverScale(img: Frame, view: View): number {
  return Math.max(view.w / img.width, view.h / img.height);
}

/** Where the image sits for a camera, clamped so it always covers the view. */
export function place(img: Frame, view: View, cam: Cam): Placement {
  const s = coverScale(img, view) * Math.max(1, cam.z);
  const w = img.width * s;
  const h = img.height * s;
  const dx = Math.min(0, Math.max(view.w - w, view.w / 2 - cam.x * w));
  const dy = Math.min(0, Math.max(view.h - h, view.h / 2 - cam.y * h));
  return { s, dx, dy };
}

export type DrawOptions = { alpha?: number; blur?: number };

let filterSupported: boolean | null = null;
function canFilter(ctx: CanvasRenderingContext2D) {
  if (filterSupported === null) filterSupported = typeof ctx.filter === "string";
  return filterSupported;
}

export function drawPlaced(
  ctx: CanvasRenderingContext2D,
  img: Drawable,
  p: Placement,
  { alpha = 1, blur = 0 }: DrawOptions = {},
) {
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (blur > 0.25 && canFilter(ctx)) ctx.filter = `blur(${blur.toFixed(2)}px)`;
  ctx.drawImage(img, p.dx, p.dy, img.width * p.s, img.height * p.s);
  ctx.restore();
}

export function drawCam(ctx: CanvasRenderingContext2D, img: Drawable, view: View, cam: Cam, opts?: DrawOptions) {
  const p = place(img, view, cam);
  drawPlaced(ctx, img, p, opts);
  return p;
}

/**
 * Draws `img` into a scratch canvas and cuts it with a feathered circle, so
 * the next shot is discovered inside the current one rather than faded over
 * it.
 */
export function drawMasked(
  ctx: CanvasRenderingContext2D,
  scratch: CanvasRenderingContext2D,
  img: Drawable,
  p: Placement,
  mask: { cx: number; cy: number; r: number; feather: number },
  alpha: number,
  blur = 0,
) {
  if (alpha <= 0.001) return;
  const { canvas } = scratch;
  scratch.save();
  scratch.setTransform(1, 0, 0, 1, 0, 0);
  scratch.globalCompositeOperation = "source-over";
  scratch.clearRect(0, 0, canvas.width, canvas.height);
  drawPlaced(scratch, img, p, { blur });
  const g = scratch.createRadialGradient(mask.cx, mask.cy, mask.r * (1 - mask.feather), mask.cx, mask.cy, mask.r);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  scratch.globalCompositeOperation = "destination-in";
  scratch.fillStyle = g;
  scratch.fillRect(0, 0, canvas.width, canvas.height);
  scratch.restore();

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
}
