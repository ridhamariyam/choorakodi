/* Choorakodi preloader — dependency-free, reusable Web Component. */
(() => {
  'use strict';
  if (customElements.get('ck-preloader')) return;

  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        --ck-background: #f3efe6;
        --ck-accent: #c4a487;
        --ck-foreground: #0d6f6b;
        position: fixed; inset: 0; display: grid; place-items: center;
        overflow: hidden; isolation: isolate; z-index: 10000;
        font-family: Arial, Helvetica, sans-serif;
        color: var(--ck-foreground); contain: layout paint;
      }
      :host([preview]) { position: absolute; z-index: 5; }
      *, *::before, *::after { box-sizing: border-box; }
      .door {
        position: absolute; top: 0; bottom: 0; width: 50.1%;
        /* A warm haze at the top echoes the sunlit cloud the hero opens on. */
        background: linear-gradient(180deg, color-mix(in srgb, var(--ck-background) 78%, #e8c49a) 0%, var(--ck-background) 48%, color-mix(in srgb, var(--ck-background) 90%, #c9a27c) 100%);
        transition: opacity 1000ms cubic-bezier(.4, 0, .2, 1) 450ms, transform 1100ms cubic-bezier(.22, 1, .36, 1);
      }
      .left { left: 0; transform-origin: left; }
      .right { right: 0; transform-origin: right; }
      .glow {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at 50% 48%, color-mix(in srgb, var(--ck-accent) 16%, transparent), transparent 62%);
        transition: opacity 300ms ease;
      }
      .grain {
        position: absolute; inset: 0; opacity: .035; pointer-events: none;
        background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="180" height="180"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" opacity=".7" filter="url(%23n)"/%3E%3C/svg%3E');
        transition: opacity 300ms ease;
      }
      .content {
        position: relative; z-index: 2; text-align: center; width: calc(100% - 40px);
        /* Sit above optical centre: the eye reads true centre as low. */
        top: clamp(-96px, -9vh, -36px);
        transition: opacity 520ms ease, transform 900ms cubic-bezier(.22, 1, .36, 1), filter 700ms ease;
      }
      .brand-logo {
        width: clamp(225px, 31vw, 300px); max-width: 76vw; height: auto; overflow: visible;
        /* The point the exit zooms into: the open ground inside the emblem's
           ring, below the figure, so the camera passes through the mark. */
        transform-origin: 50% 57%;
        transition: transform 1500ms cubic-bezier(.7, 0, .84, 0), opacity 650ms ease 800ms;
        will-change: transform;
      }
      .brand-label { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
      .logo-emblem .st1, .logo-emblem .st2 {
        stroke: #c4a487; stroke-width: 2; fill-opacity: 0;
        stroke-dasharray: 1; stroke-dashoffset: 1;
        animation: trace 1050ms cubic-bezier(.25,.1,.25,1) 70ms forwards, fill-logo 550ms ease 780ms forwards;
      }
      .logo-emblem .st0 { opacity: 0; transform: translateY(8px); animation: stance 650ms cubic-bezier(.2,.7,.2,1) 290ms forwards; }
      .logo-wordmark { opacity: 0; clip-path: inset(0 100% 0 0); animation: word-reveal 700ms cubic-bezier(.2,.7,.2,1) 470ms forwards; }
      .logo-tagline { opacity: 0; animation: appear 650ms ease 900ms forwards; }
      .loading { width: 124px; margin: 32px auto 0; opacity: 0; animation: appear 600ms ease 750ms forwards; }
      .rail { height: 1px; position: relative; background: color-mix(in srgb, var(--ck-accent) 22%, transparent); overflow: hidden; }
      .beam { position: absolute; inset: 0; background: var(--ck-accent); transform: translateX(-110%); animation: travel 1800ms ease-in-out infinite; }
      .status { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
      .dust-field { position: absolute; inset: 0; pointer-events: none; }
      .dust { position: absolute; width: 2px; height: 2px; background: var(--ck-accent); border-radius: 50%; opacity: 0; animation: float 5s ease-in-out infinite; }
      .dust:nth-child(1) { left: 27%; top: 65%; animation-delay: 100ms; }
      .dust:nth-child(2) { left: 68%; top: 42%; animation-delay: 1200ms; }
      .dust:nth-child(3) { left: 34%; top: 33%; animation-delay: 750ms; }
      .dust:nth-child(4) { left: 73%; top: 69%; animation-delay: 1800ms; }
      .skip {
        position: absolute; z-index: 3; bottom: max(24px, env(safe-area-inset-bottom)); right: 28px;
        color: var(--ck-foreground); background: none; border: 0; padding: 12px 0 12px 12px;
        font: 9px Arial, sans-serif; letter-spacing: .15em; text-transform: uppercase;
        opacity: .7; cursor: pointer; transition: opacity 160ms;
      }
      .skip:hover, .skip:focus-visible { opacity: 1; }
      .skip:focus-visible { outline: 1px solid var(--ck-accent); outline-offset: 4px; }
      :host(.ready) .beam { animation: none; transform: translateX(0); transition: transform 160ms ease; }
      /* Exit: the camera flies into the logo. The mark zooms in, accelerating,
         until it is far larger than the screen; the ground dissolves like haze
         into the hero's sky behind it, and the hero settles out of its own
         zoom (CinematicHero), so the first frame is arrived at, not cut to. */
      :host(.leaving) { pointer-events: none; }
      :host(.leaving) .left, :host(.leaving) .right { opacity: 0; }
      :host(.leaving) .brand-logo { transform: scale(26); opacity: 0; }
      :host(.leaving) .loading { opacity: 0; transition: opacity 250ms ease; }
      :host(.leaving) .glow, :host(.leaving) .grain, :host(.leaving) .skip, :host(.leaving) .dust { opacity: 0; }
      @keyframes trace { to { stroke-dashoffset: 0; } }
      @keyframes fill-logo { to { fill-opacity: 1; stroke-opacity: 0; } }
      @keyframes stance { to { opacity: 1; transform: translateY(0); } }
      @keyframes word-reveal { 0% { opacity: 0; clip-path: inset(0 100% 0 0); } 15% { opacity: 1; } 100% { opacity: 1; clip-path: inset(0 0 0 0); } }
      @keyframes appear { to { opacity: 1; } }
      @keyframes travel { 0% { transform: translateX(-110%); } 100% { transform: translateX(110%); } }
      @keyframes float { 0%,100% { opacity: 0; transform: translateY(12px); } 50% { opacity: .45; transform: translateY(-20px); } }
      @media (max-width: 480px) { .brand-logo { width: 244px; max-width: 78vw; } .loading { margin-top: 26px; } }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation: none !important; transition: none !important; }
        .logo-emblem .st1, .logo-emblem .st2 { fill-opacity: 1; stroke-opacity: 0; stroke-dashoffset: 0; }
        .logo-emblem .st0, .logo-wordmark, .logo-tagline, .loading { opacity: 1; transform: none; clip-path: none; }
        .dust { display: none; }
        .beam { transform: none; opacity: .7; }
      }
    </style>
    <div class="door left"></div><div class="door right"></div>
    <div class="glow"></div><div class="grain"></div>
    <div class="dust-field" aria-hidden="true"><i class="dust"></i><i class="dust"></i><i class="dust"></i><i class="dust"></i></div>
    <div class="content">
<svg xmlns="http://www.w3.org/2000/svg" class="brand-logo" viewBox="72 95 856 812" fill="none" aria-hidden="true">
<style type="text/css">
	.st0{fill:#0D6F6B;}
	.st1{fill:#C4A487;}
	.st2{fill:#A78D72;}
</style>
<g class="logo-wordmark">
	<path class="st2" d="M363.66,770.33c-0.22,0.92-0.44,1.35-0.81,1.61c-0.44,0.31-0.92,0.31-1.16-0.04c-0.21-0.3-0.13-0.71,0.15-0.91   c0.3-0.21,0.7-0.15,0.9,0.14c0.2-0.24,0.36-0.56,0.43-0.96L363.66,770.33z" pathLength="1" />
</g>
<g>
	<g>
		<g>
			<g>
				<g class="logo-wordmark">
					<path class="st0" d="M155.3,810.5c-1.5,5.35-4.28,13.48-5.99,17.22c-2.78,0.64-11.55,2.78-19.68,2.78       c-28.77,0-40.65-18.5-40.65-35.51c0-22.14,16.9-37.12,42.57-37.12c9.31,0,17.54,2.25,20.22,2.57       c0.54,5.03,1.28,12.94,2.03,17.65l-4.28,0.75c-2.25-8.34-5.45-12.3-11.12-14.55c-2.57-1.07-6.42-1.5-9.3-1.5       c-15.51,0-23.32,12.94-23.32,29.73c0,19.57,10.05,32.84,24.71,32.84c8.98,0,14.97-4.71,20.75-16.47L155.3,810.5z" pathLength="1" />
					<path class="st0" d="M241.18,763.33c-8.34,0.86-9.09,1.5-9.09,10.38v40.97c0,8.88,0.85,9.52,9.09,10.27v3.96h-33.05v-3.96       c8.45-1.07,9.09-1.39,9.09-10.27v-20.11h-28.88v20.11c0,8.88,0.96,9.41,8.98,10.27v3.96h-32.94v-3.96       c7.92-0.86,9.09-1.39,9.09-10.27V773.7c0-8.88-0.96-9.73-9.09-10.38v-3.96h32.94v3.96c-8.13,0.75-8.98,1.5-8.98,10.38V789       h28.88v-15.3c0-8.88-1.07-9.52-9.09-10.38v-3.96h33.05V763.33z" pathLength="1" />
					<path class="st0" d="M287.92,757.87c19.79,0,35.94,14.44,35.94,35.51c0,22.78-16.26,37.12-36.47,37.12       c-21.39,0-36.9-15.62-36.9-36.26C250.48,775.95,263.53,757.87,287.92,757.87z M286.31,762.58c-10.91,0-18.93,10.69-18.93,29.63       c0,18.08,7.17,33.59,21.6,33.59c10.16,0,18.08-9.84,18.08-29.41C307.06,775.2,298.72,762.58,286.31,762.58z" pathLength="1" />
					<path class="st0" d="M372.41,757.87c19.79,0,35.94,14.44,35.94,35.51c0,22.78-16.26,37.12-36.47,37.12       c-21.39,0-36.9-15.62-36.9-36.26C334.97,775.95,348.02,757.87,372.41,757.87z M370.8,762.58c-10.91,0-18.93,10.69-18.93,29.63       c0,18.08,7.17,33.59,21.6,33.59c10.16,0,18.08-9.84,18.08-29.41C391.56,775.2,383.21,762.58,370.8,762.58z" pathLength="1" />
					<path class="st0" d="M484.92,829.53c-0.64,0-1.92,0-3.21-0.11c-13.58-0.64-17.54-3.53-20.75-8.02       c-4.28-5.88-7.38-12.41-11.02-18.83c-1.6-2.89-3.1-3.53-6.52-3.53l-2.14-0.11v15.62c0,8.66,1.07,9.41,9.09,10.37v3.96h-32.73       v-3.96c8.13-0.86,9.09-1.71,9.09-10.37V773.6c0-8.45-1.07-9.63-9.09-10.27v-3.96h31.02c9.52,0,14.97,1.07,19.36,4.06       c4.28,2.89,7.17,7.59,7.17,14.23c0,9.52-6.31,14.55-13.37,17.33c1.61,3.21,5.78,10.16,8.99,15.08       c3.74,5.88,6.1,8.77,8.13,11.12c2.46,2.78,3.64,3.64,6.74,4.71L484.92,829.53z M444.17,794.56c4.6,0,8.13-0.75,10.48-2.78       c3.53-2.99,5.03-7.06,5.03-12.51c0-11.34-6.52-15.4-12.51-15.4c-2.89,0-4.28,0.43-4.92,1.07c-0.75,0.64-0.96,1.93-0.96,4.06       v25.56H444.17z" pathLength="1" />
					<path class="st0" d="M529.41,828.89v-3.96c6.74-0.96,6.74-2.14,5.24-6.74c-1.07-3.21-2.78-8.02-4.39-12.3h-20.86       c-1.18,3.32-2.67,7.38-3.74,10.7c-2.25,6.74,0.32,7.59,8.77,8.34v3.96h-26.42v-3.96c6.74-0.86,8.45-1.82,12.09-10.8l22.25-55.3       l5.13-0.96c6.85,18.61,14.12,37.65,21.07,55.51c3.96,9.95,4.92,10.69,11.87,11.55v3.96H529.41z M520,777.77       c-3.1,7.7-6.1,14.87-8.77,22.67h17.01L520,777.77z" pathLength="1" />
					<path class="st0" d="M564.27,759.37h32.41v3.96c-7.7,0.96-8.88,1.5-8.88,10.48v17.97c2.25-0.64,4.81-2.35,8.34-5.67       c7.27-7.17,11.98-12.94,15.19-17.01c2.57-3.32,1.93-4.92-2.99-5.56l-2.03-0.21v-3.96h28.02v3.96       c-7.38,0.96-11.34,1.5-18.08,8.77c-4.17,4.39-9.41,9.73-14.12,14.87c6.74,9.41,15.08,20.86,23.32,31.23       c3.96,5.13,5.35,5.88,10.8,6.74v3.96h-21.29c-4.49-6.1-13.9-19.04-21.5-29.84c-2.25-3.21-3.96-3.85-5.67-3.53v18.93       c0,9.09,0.75,9.41,8.99,10.48v3.96h-32.52v-3.96c8.02-0.86,9.09-1.39,9.09-10.48v-40.64c0-8.99-1.07-9.73-9.09-10.48V759.37z" pathLength="1" />
					<path class="st0" d="M640.1,759.37h32.41v3.96c-7.7,0.96-8.88,1.5-8.88,10.48v17.97c2.25-0.64,4.81-2.35,8.34-5.67       c7.27-7.17,11.98-12.94,15.19-17.01c2.57-3.32,1.92-4.92-3-5.56l-2.03-0.21v-3.96h28.02v3.96c-7.38,0.96-11.34,1.5-18.08,8.77       c-4.17,4.39-9.41,9.73-14.12,14.87c6.74,9.41,15.08,20.86,23.32,31.23c3.96,5.13,5.35,5.88,10.8,6.74v3.96H690.8       c-4.49-6.1-13.9-19.04-21.5-29.84c-2.25-3.21-3.96-3.85-5.67-3.53v18.93c0,9.09,0.75,9.41,8.99,10.48v3.96H640.1v-3.96       c8.02-0.86,9.09-1.39,9.09-10.48v-40.64c0-8.99-1.07-9.73-9.09-10.48V759.37z" pathLength="1" />
					<path class="st0" d="M750.38,757.87c19.79,0,35.94,14.44,35.94,35.51c0,22.78-16.26,37.12-36.47,37.12       c-21.39,0-36.9-15.62-36.9-36.26C712.94,775.95,725.99,757.87,750.38,757.87z M748.77,762.58c-10.91,0-18.93,10.69-18.93,29.63       c0,18.08,7.17,33.59,21.6,33.59c10.16,0,18.08-9.84,18.08-29.41C769.52,775.2,761.18,762.58,748.77,762.58z" pathLength="1" />
					<path class="st0" d="M828.45,759.37c13.69,0,23.74,2.89,30.59,9.31c5.46,5.03,9.63,12.51,9.63,23.32       c0,12.3-5.13,21.71-13.37,27.92c-7.92,5.99-18.08,8.99-30.27,8.99h-29.41v-3.96c8.13-0.64,9.09-1.6,9.09-10.48v-40.64       c0-8.99-1.18-9.84-9.09-10.48v-3.96H828.45z M819.57,813.71c0,7.59,1.92,10.16,9.73,10.16c14.44,0,22.78-10.05,22.78-30.27       c0-10.16-2.78-19.04-7.7-23.64c-4.49-4.49-10.06-5.99-17.22-5.99c-3.96,0-5.78,0.85-6.42,1.5c-0.96,0.96-1.18,2.78-1.18,5.88       V813.71z" pathLength="1" />
					<path class="st0" d="M877.96,828.89v-3.96c8.13-0.75,9.09-1.39,9.09-10.37v-40.75c0-8.99-1.07-9.84-9.09-10.48v-3.96h33.05       v3.96c-8.02,0.75-9.09,1.5-9.09,10.48v40.75c0,8.88,0.96,9.52,9.09,10.37v3.96H877.96z" pathLength="1" />
				</g>
				<g class="logo-tagline">
					<path class="st1" d="M163.69,859.76h4.28l10.22,19.03l10.22-19.03h4.28v29.12h-4.28v-20.73l-10.22,19.03l-10.22-19.03v20.73       h-4.28V859.76z" pathLength="1" />
					<path class="st1" d="M226.72,882.95h-15.18l-2.54,5.93h-4.75l12.51-29.12h4.75l12.51,29.12h-4.75L226.72,882.95z        M225.07,879.09l-5.93-13.82l-5.93,13.82H225.07z" pathLength="1" />
					<path class="st1" d="M260.68,878.33l7.42,10.56h-4.92l-7.12-10.13h-6.7v10.13h-4.28v-29.12h12.25c6.15,0,10.81,3.94,10.81,9.5       C268.14,873.75,265.09,877.19,260.68,878.33z M249.36,874.77h7.38c4.2,0,7.04-2.08,7.04-5.51c0-3.43-2.84-5.51-7.04-5.51h-7.38       V874.77z" pathLength="1" />
					<path class="st1" d="M287.89,863.75h-9.54v-3.98h23.4v3.98h-9.58v25.14h-4.28V863.75z" pathLength="1" />
					<path class="st1" d="M313.46,859.76h4.28v29.12h-4.28V859.76z" pathLength="1" />
					<path class="st1" d="M351.31,882.95h-15.18l-2.54,5.93h-4.75l12.51-29.12h4.75l12.51,29.12h-4.75L351.31,882.95z        M349.66,879.09l-5.93-13.82l-5.93,13.82H349.66z" pathLength="1" />
					<path class="st1" d="M389.04,884.9v3.98h-19.75v-29.12h4.32v25.14H389.04z" pathLength="1" />
					<path class="st1" d="M439.61,882.95h-15.18l-2.54,5.93h-4.75l12.51-29.12h4.75l12.51,29.12h-4.75L439.61,882.95z        M437.96,879.09l-5.93-13.82l-5.93,13.82H437.96z" pathLength="1" />
					<path class="st1" d="M473.57,878.33l7.42,10.56h-4.92l-7.12-10.13h-6.7v10.13h-4.28v-29.12h12.25c6.15,0,10.81,3.94,10.81,9.5       C481.03,873.75,477.98,877.19,473.57,878.33z M462.25,874.77h7.38c4.2,0,7.04-2.08,7.04-5.51c0-3.43-2.84-5.51-7.04-5.51h-7.38       V874.77z" pathLength="1" />
					<path class="st1" d="M500.78,863.75h-9.54v-3.98h23.4v3.98h-9.58v25.14h-4.28V863.75z" pathLength="1" />
					<path class="st1" d="M524.73,884.69l2.59-3.18c2.59,2.46,5.64,4.07,9.58,4.07c4.03,0,6.1-2.12,6.1-4.45       c0-2.76-2.42-3.82-7.29-4.92c-5.93-1.4-9.88-3.18-9.88-8.44c0-4.88,4.24-8.56,10.09-8.56c4.49,0,7.84,1.65,10.64,4.11       l-2.46,3.22c-2.46-2.25-5.38-3.56-8.35-3.56c-3.26,0-5.55,2.08-5.55,4.41c0,2.71,2.5,3.65,7.29,4.79       c5.81,1.36,9.83,3.31,9.83,8.52c0,4.92-3.73,8.65-10.6,8.65C531.86,889.35,527.83,887.66,524.73,884.69z" pathLength="1" />
					<path class="st1" d="M598.66,882.95h-15.18l-2.54,5.93h-4.75l12.51-29.12h4.75l12.51,29.12h-4.75L598.66,882.95z        M597.01,879.09l-5.93-13.82l-5.93,13.82H597.01z" pathLength="1" />
					<path class="st1" d="M615.87,874.3c0-8.18,6.95-15.05,15.13-15.05c4.15,0,7.97,1.74,10.73,4.58l-3.01,2.88       c-1.95-2.12-4.71-3.52-7.72-3.52c-5.81,0-10.73,5.09-10.73,11.11c0,6.06,4.92,11.15,10.73,11.15c3.01,0,5.77-1.4,7.72-3.52       l3.01,2.88c-2.76,2.8-6.57,4.58-10.73,4.58C622.82,889.4,615.87,882.49,615.87,874.3z" pathLength="1" />
					<path class="st1" d="M673.23,882.95h-15.18l-2.54,5.93h-4.75l12.51-29.12h4.75l12.51,29.12h-4.75L673.23,882.95z        M671.58,879.09l-5.93-13.82l-5.93,13.82H671.58z" pathLength="1" />
					<path class="st1" d="M692.09,859.76h10.05c9.41,0,16.11,6.02,16.11,14.54s-6.7,14.58-16.11,14.58h-10.05V859.76z        M702.39,884.99c6.74,0,11.45-4.41,11.45-10.68c0-6.23-4.71-10.64-11.45-10.64h-6.02v21.32H702.39z" pathLength="1" />
					<path class="st1" d="M734.99,863.75v8.31h15.43v3.98h-15.43v8.86h17.08v3.98h-21.41v-29.12h21.41v3.98H734.99z" pathLength="1" />
					<path class="st1" d="M764.75,859.76h4.28l10.22,19.03l10.22-19.03h4.28v29.12h-4.28v-20.73l-10.22,19.03l-10.22-19.03v20.73       h-4.28V859.76z" pathLength="1" />
					<path class="st1" d="M816.43,877.48l-11.66-17.72h5.17l8.69,13.65l8.82-13.65h4.96l-11.57,17.72v11.4h-4.41V877.48z" pathLength="1" />
				</g>
			</g>
		</g>
	</g>
	<g class="logo-emblem">
		<g>
			<path class="st1" d="M688.61,313.34c-0.74,3.07-1.45,4.49-2.71,5.38c-1.46,1.03-3.06,1.04-3.88-0.13     c-0.71-1.01-0.43-2.36,0.5-3.02c0.98-0.69,2.33-0.49,3,0.47c0.68-0.79,1.19-1.87,1.44-3.21L688.61,313.34z" pathLength="1" />
		</g>
		<g>
			<g>
				<g>
					<path class="st0" d="M489.42,363.81c-8.93-5.24-17.4-9.2-25.41-12.08c-21.01-7.58-38.78-7.75-53.02-4.2       c-21.41,5.33-34.86,19.06-39.37,28.61c0,0,37.47-15.31,73.76,15.02c58.83,49.17,47.92,126.96,47.92,126.96       s22.67-9.25,29.21-56.73c2.07-14.99-1.55-30.01-8.39-44.48c24.38,6.42,48.97,7.85,69.28-2.63       c43.56-22.48,44.76-47.48,44.76-47.48S557.03,403.52,489.42,363.81z" pathLength="1" />
					<circle class="st0" cx="553.94" cy="329.98" r="30.85" pathLength="1" />
				</g>
				<g>
					<path class="st1" d="M315.24,357.28c-8.04-2.35-12.79-11.2-10.4-19.37c1.23-4.21,4.14-7.52,7.78-9.44l2.37,4.72       c-2.55,1.15-4.6,3.36-5.41,6.11c-1.55,5.29,1.73,11.09,7.19,12.69c5.5,1.61,11.39-1.51,12.94-6.8c0.82-2.79,0.27-5.71-1.25-8.1       l4.49-2.67c2.07,3.59,2.74,7.95,1.51,12.16C332.08,354.75,323.28,359.64,315.24,357.28z" pathLength="1" />
					<path class="st1" d="M315.65,310.08l2.7-4.71l20.66,0.52l-10.89-17.59l2.67-4.67l25.88,14.82l-2.67,4.67l-17.29-9.9       l10.89,17.59l-20.66-0.52l17.29,9.9l-2.69,4.71L315.65,310.08z" pathLength="1" />
					<path class="st1" d="M343.77,266.48l3.79-3.88l19.85,5.7l-6.11-19.75l3.76-3.85l21.31,20.84l-3.76,3.85l-14.24-13.92       l6.11,19.75l-19.86-5.7l14.24,13.92l-3.79,3.88L343.77,266.48z" pathLength="1" />
					<path class="st1" d="M419.58,225.51l11.51-5.43l5.15,10.92c-1.31,3.93-4.72,7.6-8.64,9.45c-7.74,3.65-17.27,0.32-20.85-7.26       s-0.06-17.01,7.68-20.66c3.93-1.85,8.91-2.19,12.78-0.7l-1.96,4.91c-2.61-1.17-6.08-0.97-8.71,0.27       c-5.03,2.37-7.23,8.69-4.8,13.84c2.44,5.18,8.72,7.5,13.75,5.13c2.04-0.96,3.91-2.71,5.02-4.72l-2.31-4.91l-6.71,3.17       L419.58,225.51z" pathLength="1" />
					<path class="st1" d="M447.66,218.38l-3.6-16.72l5.31-1.14l3.56,16.55c1.04,4.84,4.93,7.64,9.35,6.69       c4.46-0.96,6.85-5.12,5.81-9.96l-3.56-16.55l5.26-1.13l3.6,16.72c1.64,7.6-2.52,14.09-10.07,15.72       C455.79,230.18,449.29,225.98,447.66,218.38z" pathLength="1" />
					<path class="st1" d="M507.68,224.28l-6.87-10.14l-5.77-0.09l-0.17,10.02l-5.42-0.09l0.49-29.82l12.98,0.21       c6.38,0.11,11.08,4.26,10.99,10.08c-0.07,4.51-3.04,7.94-7.36,9.21l7.29,10.71L507.68,224.28z M495.12,209.05l6.94,0.12       c3.69,0.06,6.28-1.76,6.33-4.8c0.05-3.04-2.48-4.95-6.17-5.01l-6.94-0.12L495.12,209.05z" pathLength="1" />
					<path class="st1" d="M528.45,213.14l3.78-16.68l5.29,1.2l-3.74,16.51c-1.09,4.83,1.25,9.01,5.66,10.01       c4.44,1.01,8.36-1.76,9.46-6.58l3.74-16.51l5.25,1.19l-3.78,16.68c-1.72,7.58-8.22,11.71-15.75,10.01       C530.85,227.26,526.73,220.72,528.45,213.14z" pathLength="1" />
					<path class="st1" d="M577.1,209.14l4.9,2.34l-6.29,13.17l18.08-7.54l5.99,2.86l-16.44,6.73l4.38,20.57l-6.03-2.88l-3.36-15.84       l-5.52,2.18l-3.67,7.68l-4.9-2.34L577.1,209.14z" pathLength="1" />
					<path class="st1" d="M615.14,229.72l4.29,3.32l-8.92,11.54l19.26-3.55l5.25,4.06l-17.49,3.1l-0.07,21.02l-5.29-4.09l0.06-16.19       l-5.85,0.96l-5.2,6.73l-4.29-3.32L615.14,229.72z" pathLength="1" />
					<path class="st1" d="M642.95,289.91l-9.14-11.15l-5.59,1.67l-3.83-4.67l30.96-9.28l3.83,4.67l-15.16,28.55l-3.8-4.63       L642.95,289.91z M645.34,285.43l6.37-12.02l-13.03,3.89L645.34,285.43z" pathLength="1" />
					<path class="st1" d="M663.49,325.21l-4.39,2.29l-9.57-18.36l26.45-13.78l2.49,4.77l-22.06,11.49L663.49,325.21z" pathLength="1" />
					<path class="st1" d="M667.12,335.49l4.59,1.9c-1.6,3.33-2.2,6.81-1.09,10.55c1.05,3.54,3.34,4.85,5.38,4.25       c2.37-0.7,2.56-2.98,2.29-7.87c-0.37-6.32,0.11-10.94,5.48-12.53c5-1.48,9.91,1.68,11.7,7.72c1.34,4.54,0.81,8.41-0.79,12.01       l-4.67-1.7c1.43-3.14,1.78-6.37,0.94-9.2c-0.85-2.87-3.18-4.31-5.18-3.72c-2.33,0.69-2.54,3.06-2.23,7.9       c0.43,6.35-0.3,10.91-5.5,12.45c-5.12,1.52-9.9-1.33-11.92-8.15C664.67,344.19,665.1,339.53,667.12,335.49z" pathLength="1" />
				</g>
			</g>
			<g>
				<path class="st1" d="M781.96,110.63c-45.55,31.86-90.27,64.91-134.21,98.97l32.58,29.4      C715.14,196.97,749.15,154.24,781.96,110.63z" pathLength="1" />
				<path class="st1" d="M319.46,238.97l32.61-29.37c-43.94-34.06-88.72-67.11-134.24-98.99c32.79,43.56,66.69,86.26,101.53,128.21      C319.38,238.87,319.43,238.92,319.46,238.97z M242.44,134.36C242.44,134.36,242.44,134.36,242.44,134.36      S242.44,134.36,242.44,134.36L242.44,134.36z" pathLength="1" />
				<path class="st1" d="M790.59,642.53c-1.84-0.34-3.11,1.24-4.37,2.25c-3.21-1.14-6.37-2.38-9.47-3.78      c-0.54-1.58-0.98-3.52-2.69-4.22c-1.58-0.85-3.29-0.08-4.84,0.39c-1.94-1.19-3.73-2.59-5.38-4.14c1.01-1.92,2.38-3.83,2.33-6.08      c0.1-1.09-0.28-2.36,0.62-3.18c2.74-3.44,5.51-6.91,7.87-10.61c2.38-3.75,4.81-7.71,5.2-12.22c3.1-1.6,6-3.99,6.99-7.51      c1.45-0.88,3.23-3,1.5-4.53c-1.71-0.26-3.49-0.34-4.94-1.4c1.09-2.12,2.28-4.22,3.62-6.18c-1.14-1.6-2.23-3.36-3.99-4.37      c-1.42-0.85-3.13-0.72-4.69-0.78c-0.05-1.37-0.1-2.72-0.18-4.06c-2.2-0.7-4.5-0.98-6.81-1.04c-0.75-9.55-2.59-19.12-6.34-27.98      c-2.2-4.99-4.97-9.94-9.34-13.3c-6.18-4.79-14.23-6.52-21.92-6.34c-2.82,0.03-5.82,1.04-8.51-0.23      c-3.73-1.73-5.93-5.49-9.32-7.69c-4.06-2.35-9.01-2.69-13.53-1.94c-1.37,0.31-3.03,0.54-3.81,1.86      c0.93,3.75,2.87,7.56,1.55,11.52c-2.02,6.16-6.99,11.28-12.99,13.66c-6.7-6.16-12.58-13.12-18.79-19.77l-4.41,5.24      c24.53-33.56,39.03-74.9,39.03-119.56h-6.95c0,108.15-87.99,196.13-196.13,196.13c-108.15,0-196.13-87.99-196.13-196.13h-6.95      c0,45.28,14.9,87.14,40.04,120.94l-6.43-7.63c-6.24,6.63-12.11,13.59-18.81,19.75c-5.98-2.38-10.92-7.48-12.94-13.59      c-1.4-3.96,0.6-7.84,1.5-11.65c-0.96-1.4-2.85-1.63-4.43-1.94c-5.43-0.72-11.67,0.1-15.6,4.3c-2.98,2.95-6.39,6.88-11.08,6.03      c-11.23-1.45-24.33,1.53-31,11.39c-7.01,10.58-9.57,23.45-10.64,35.9c-2.23,0.26-4.84-0.1-6.73,1.32      c-0.23,1.24-0.23,2.51-0.31,3.78c-3.83-0.65-6.86,2.02-8.62,5.12c1.35,1.99,2.54,4.09,3.6,6.24c-1.47,1.06-3.29,1.09-4.99,1.42      c-1.63,1.58,0.18,3.57,1.58,4.5c0.98,3.49,3.86,5.87,6.96,7.45c0.28,2.07,0.75,4.17,1.71,6.06c3.1,6.5,7.63,12.11,12.09,17.73      c-0.75,3.03,0.75,5.82,2.23,8.33c-1.63,1.55-3.42,2.95-5.36,4.14c-1.53-0.41-3.21-1.24-4.79-0.41c-1.76,0.67-2.2,2.64-2.77,4.24      c-3.08,1.4-6.24,2.64-9.45,3.8c-1.37-1.19-3.1-3.05-5.1-2.02c-2.49,1.55-2.28,5.12-1.42,7.58c0.83,2.25,2.72,4.92,5.43,4.55      c1.81-0.41,2.2-2.41,2.8-3.86c3.52-0.93,6.96-2.2,10.27-3.68c1.68-0.8,3.65,0.21,5.3-0.65c1.32-0.67,1.79-2.15,2.46-3.34      c2.54-1.68,5.1-3.29,7.56-5.07c2.66,1.94,5.72,3.99,9.16,3.23c5.8,5.02,11.72,10.15,18.71,13.41c1.81,0.7,4.09,1.71,5.87,0.47      c1.16-1.53,0.44-3.54-0.05-5.18c-2.15-5.74-6.01-10.61-9.5-15.58c-1.92-5.05-1.01-10.77,1.06-15.63c0.83,0.03,1.68,0,2.51-0.05      c1.14-0.49,0.98-1.89,1.27-2.85c10.2-3.7,18.81-10.77,26.27-18.5c4.26-4.45,8.04-9.41,10.99-14.82      c0.91,0.94,1.81,1.88,2.72,2.82c3.75-3.24,7.53-6.44,11.28-9.68c-0.32-0.34-0.62-0.7-0.94-1.04c3.61,0.23,7.19,1.31,10.29,3.1      c4.71,3.08,9.71,6.91,11.23,12.63c0.93,2.95,0.28,6.21-1.53,8.7c-1.11,1.79-2.82,3.18-3.68,5.12c-0.54,1.55,1.29,2.36,2.54,2.43      c4.32,0.36,8.59-1.11,12.34-3.16c7.56-4.09,12.34-12.68,11.91-21.22c-0.13-1.63-0.36-3.36-1.55-4.55      c-3.88,0.72-7.82,2.64-11.77,1.16c-6.11-2.25-11.13-7.43-13.22-13.59c5.8-5.85,12.24-11,18.5-16.36l-1.34-1.59      c37.01,38.82,89.2,63.04,146.94,63.04c57.36,0,109.24-23.91,146.2-62.28l-1.56,1.86c6.19,5.38,12.66,10.51,18.45,16.36      c-1.04,2.87-2.54,5.62-4.71,7.79c-3.05,3.13-6.88,6.06-11.44,6.31c-3.11,0.28-5.9-1.35-8.93-1.66      c-1.11,1.24-1.37,2.95-1.48,4.55c-0.44,8.51,4.32,17.06,11.78,21.14c3.93,2.12,8.44,3.73,12.94,3.13      c1.37-0.1,2.82-1.48,1.84-2.85c-2.04-3.13-5.28-5.85-5.38-9.89c-0.21-5.98,4.17-10.79,8.72-14.08c3.73-3.03,8.48-4.82,13.29-5.1      c-0.01,0.01-0.01,0.01-0.02,0.02c3.78,3.24,7.53,6.44,11.31,9.68c0.56-0.58,1.12-1.16,1.68-1.74c3.41,6.25,7.97,11.81,13,16.84      c7.01,6.83,14.96,13.09,24.28,16.43c0.31,0.93,0.08,2.36,1.19,2.82c0.85,0.05,1.71,0.1,2.59,0.08      c2.07,4.76,2.82,10.27,1.24,15.27c-3.7,5.54-8.2,10.77-10.09,17.29c-0.44,1.48-0.57,3.88,1.37,4.35      c2.36,0.31,4.61-0.85,6.68-1.86c6.16-3.34,11.57-7.89,16.82-12.53c3.49,0.72,6.55-1.27,9.21-3.24c2.48,1.79,5.05,3.39,7.61,5.07      c0.62,1.16,1.06,2.61,2.3,3.29c1.32,0.83,2.92,0.34,4.37,0.26c3.65,1.66,7.43,3.1,11.34,4.11c0.54,1.76,1.47,4.32,3.83,3.86      c3.16-0.8,4.76-4.35,4.94-7.38C793.41,645.61,792.76,643.02,790.59,642.53z M291.74,566.85c0.57,0.59,1.13,1.17,1.7,1.76      c-6.55,3.18-12.39,7.81-17.71,12.75c-6.94,6.65-13.28,14.29-16.93,23.32c-0.83,0.1-1.6,0.26-2.38,0.52      c-0.88,0.78-0.47,2.07-0.6,3.08c-4.84,2.04-10.59,2.59-15.53,0.67c-5.82-4.27-11.41-9.47-18.69-11.05      c4.58-5.28,7.43-11.8,9.29-18.48c1.79-6.29,2.17-12.89,4.06-19.15c2.49-8.8,6.83-17.55,14.29-23.14      c5.82-4.43,13.25-6.19,20.47-6.13c7.38-0.03,15.42,0.41,21.53,5.05c3.57,2.82,6.34,6.6,8.44,10.64      c1.31,2.91,1.99,6.09,2.05,9.27C298.41,559.58,295.07,563.22,291.74,566.85z M339.39,554.13c-5.72-5.93-11.44-11.85-17.16-17.78      c3.75-4.09,7.53-8.2,11.28-12.29c1.63,2.1,3.24,4.19,4.89,6.26c-1.81,1.97-3.6,3.93-5.41,5.9c2.3,2.38,4.61,4.76,6.88,7.14      c1.86-1.58,3.7-3.16,5.56-4.71c1.71,1.97,3.47,3.88,5.23,5.8C346.92,547.69,343.15,550.9,339.39,554.13z M659.4,555.16      c-3.78-3.23-7.53-6.44-11.31-9.68c1.76-1.92,3.52-3.86,5.28-5.8c1.84,1.58,3.67,3.16,5.51,4.71c2.3-2.38,4.61-4.76,6.88-7.14      c-1.79-1.97-3.6-3.93-5.38-5.9c1.63-2.07,3.26-4.17,4.86-6.26c3.75,4.09,7.53,8.2,11.28,12.29      C670.81,543.31,665.12,549.23,659.4,555.16z M752.93,611.09c-3.44,0.26-6.86-0.47-9.99-1.79c-0.03-0.57-0.03-1.66-0.05-2.23      c-0.31-1.32-1.89-1.11-2.9-1.35c-3.73-9.24-10.25-17-17.39-23.78c-5.2-4.78-10.87-9.23-17.23-12.31      c0.89-0.93,1.79-1.86,2.68-2.78c-3.62-3.94-7.26-7.91-10.88-11.85c0.36-3.48,1.45-6.88,3.35-9.83c2.36-3.67,5.18-7.22,9.01-9.45      c4.4-2.56,9.6-3.37,14.62-3.62c6.44-0.26,13.12-0.08,19.15,2.51c6.42,2.64,11.65,7.74,15.11,13.69      c4.27,7.27,6.42,15.55,7.69,23.81c1.58,9.6,4.61,19.33,11.05,26.81c-6.88,1.53-12.4,6.29-17.83,10.51      C757.51,610.85,755.11,610.88,752.93,611.09z" pathLength="1" />
			</g>
		</g>
	</g>
</g>
</svg>
      <h1 class="brand-label"></h1>
      <div class="loading"><div class="rail"><span class="beam"></span></div><p class="status" role="status" aria-live="polite">Loading</p></div>
    </div>
    <button class="skip" type="button">Skip intro ↗</button>
  `;

  class ChoorakodiPreloader extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
      this.timers = new Set();
      this.completed = false;
      this.finishing = false;
      this.onLoad = () => this.finish();
      this.onKey = event => { if (event.key === 'Escape') this.finish(true); };
      this.shadowRoot.querySelector('.skip').addEventListener('click', () => this.finish(true));
    }

    connectedCallback() {
      this.startedAt = performance.now();
      this.shadowRoot.querySelector('.brand-label').textContent = this.getAttribute('label') || 'Choorakkodi Martial Arts Academy';
      for (const [attribute, variable] of [['background','--ck-background'], ['accent','--ck-accent'], ['foreground','--ck-foreground']]) {
        const value = this.getAttribute(attribute);
        if (value && CSS.supports('color', value)) this.style.setProperty(variable, value);
      }
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!this.hasAttribute('preview')) {
        this.oldOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        this.oldBusy = document.body.getAttribute('aria-busy');
        document.body.setAttribute('aria-busy', 'true');
        this.locked = true;
        document.addEventListener('keydown', this.onKey);
      }
      this.later(() => this.finish(true), this.number('max-wait', 10000, 1000, 60000));
      if (this.getAttribute('mode') !== 'manual') {
        if (document.readyState === 'complete') this.finish();
        else window.addEventListener('load', this.onLoad, { once: true });
      }
    }

    number(attribute, fallback, min, max) {
      const raw = this.getAttribute(attribute);
      const n = raw === null || raw.trim() === '' ? fallback : Number(raw);
      return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
    }

    later(callback, delay) {
      const timer = setTimeout(() => { this.timers.delete(timer); callback(); }, delay);
      this.timers.add(timer);
      return timer;
    }

    finish(skip = false) {
      if (this.completed) return;
      if (skip) {
        this.clearTimers();
        this.complete();
        return;
      }
      if (this.finishing) return;
      this.finishing = true;
      window.removeEventListener('load', this.onLoad);
      const minimum = this.reducedMotion ? 0 : this.number('min-duration', 1150, 0, 5000);
      const remaining = Math.max(0, minimum - (performance.now() - this.startedAt));
      this.later(() => {
        if (this.completed) return;
        this.classList.add('ready');
        this.shadowRoot.querySelector('.status').textContent = 'Page ready';
        if (this.reducedMotion) { this.complete(); return; }
        this.later(() => {
          this.classList.add('leaving');
          this.dispatchEvent(new CustomEvent('ck-leaving', { bubbles: true, composed: true }));
          this.later(() => this.complete(), 1550);
        }, 180);
      }, remaining);
    }

    complete() {
      if (this.completed) return;
      this.completed = true;
      this.clearTimers();
      this.release();
      this.dispatchEvent(new CustomEvent('ck-finished', { bubbles: true, composed: true }));
      this.remove();
    }

    release() {
      window.removeEventListener('load', this.onLoad);
      document.removeEventListener('keydown', this.onKey);
      if (this.locked) {
        document.documentElement.style.overflow = this.oldOverflow;
        if (this.oldBusy === null) document.body.removeAttribute('aria-busy');
        else document.body.setAttribute('aria-busy', this.oldBusy);
        this.locked = false;
      }
    }

    clearTimers() {
      for (const timer of this.timers) clearTimeout(timer);
      this.timers.clear();
    }

    disconnectedCallback() { this.clearTimers(); this.release(); }
  }

  customElements.define('ck-preloader', ChoorakodiPreloader);
})();
