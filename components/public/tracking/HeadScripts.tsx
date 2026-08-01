// components/public/tracking/HeadScripts.tsx
// Server Component — renders into <head>, reads the DB directly, zero
// client JS cost for visitors on sites with nothing connected yet.
import Script from "next/script";
import { getResolvedTrackingConfig } from "@/lib/tracking/render-scripts";

export async function HeadScripts() {
	const config = await getResolvedTrackingConfig();

	return (
		<>
			{config.gtm ? (
				<Script id="gtm-init" strategy="afterInteractive">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.gtm.containerId}');`}
				</Script>
			) : null}

			{config.ga4 && !config.gtm ? (
				// Only loaded directly if GTM isn't handling it — once GTM is
				// connected, GA4 is configured as a tag inside the GTM
				// container (in the GTM UI, outside this codebase) rather than
				// double-loaded here.
				<>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4.measurementId}`}
						strategy="afterInteractive"
					/>
					<Script id="ga4-init" strategy="afterInteractive">
						{`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${config.ga4.measurementId}');`}
					</Script>
				</>
			) : null}

			{config.meta ? (
				<Script id="meta-pixel-init" strategy="afterInteractive">
					{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${config.meta.pixelId}');fbq('track', 'PageView');`}
				</Script>
			) : null}

			{config.tiktok ? (
				<Script id="tiktok-pixel-init" strategy="afterInteractive">
					{`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<e.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${config.tiktok.pixelId}');ttq.page();}(window, document, 'ttq');`}
				</Script>
			) : null}

			{config.linkedin ? (
				<Script id="linkedin-insight-init" strategy="afterInteractive">
					{`_linkedin_partner_id = "${config.linkedin.partnerId}";window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s = document.getElementsByTagName("script")[0];var b = document.createElement("script");b.type = "text/javascript";b.async = true;b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b, s);})(window.lintrk);`}
				</Script>
			) : null}

			{config.x ? (
				<Script id="x-pixel-init" strategy="afterInteractive">
					{`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${config.x.pixelId}');`}
				</Script>
			) : null}

			{config.snapchat ? (
				<Script id="snapchat-pixel-init" strategy="afterInteractive">
					{`(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${config.snapchat.pixelId}');snaptr('track','PAGE_VIEW');`}
				</Script>
			) : null}
		</>
	);
}

export async function GtmNoscriptBody() {
	const config = await getResolvedTrackingConfig();
	if (!config.gtm) return null;

	return (
		<noscript>
			<iframe
				src={`https://www.googletagmanager.com/ns.html?id=${config.gtm.containerId}`}
				height="0"
				width="0"
				style={{ display: "none", visibility: "hidden" }}
				title="gtm"
			/>
		</noscript>
	);
}
