
import { CartItem, Product } from '../types';

export interface TrackingConfig {
  fbPixelId: string;
  fbCapiToken: string;
  fbTestEventCode: string;
  tiktokPixelId: string;
  gtmId: string;
  ga4Id: string;
  customScripts: string;
  isEnabled: boolean;
}

class TrackingService {
  private config: TrackingConfig = {
    fbPixelId: '',
    fbCapiToken: '',
    fbTestEventCode: '',
    tiktokPixelId: '',
    gtmId: '',
    ga4Id: '',
    customScripts: '',
    isEnabled: false,
  };

  private logs: { event: string; data: any; timestamp: string; platform: string }[] = [];

  private addLog(event: string, data: any, platform: string) {
    this.logs.unshift({
      event,
      data,
      timestamp: new Date().toLocaleTimeString(),
      platform
    });
    if (this.logs.length > 50) this.logs.pop();
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  private scriptsInjected = false;

  init(config: TrackingConfig) {
    this.config = config;
    if (!config.isEnabled) return;

    this.injectScripts();
    this.addLog('Init', config, 'System');
  }

  private injectScripts() {
    if (typeof window === 'undefined' || this.scriptsInjected) return;
    this.scriptsInjected = true;

    // Google Tag Manager
    if (this.config.gtmId) {
      this.addLog('Inject GTM', this.config.gtmId, 'GTM');
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${this.config.gtmId}');`;
      document.head.appendChild(gtmScript);
    }

    // Google Analytics 4
    if (this.config.ga4Id) {
      this.addLog('Inject GA4', this.config.ga4Id, 'GA4');
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4Id}`;
      document.head.appendChild(gaScript);

      const gaInitScript = document.createElement('script');
      gaInitScript.innerHTML = `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.config.ga4Id}');`;
      document.head.appendChild(gaInitScript);
    }

    // Facebook Pixel
    if (this.config.fbPixelId) {
      this.addLog('Inject FB Pixel', this.config.fbPixelId, 'Facebook');
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.config.fbPixelId}');
      fbq('track', 'PageView');`;
      document.head.appendChild(fbScript);
    }

    // TikTok Pixel
    if (this.config.tiktokPixelId) {
      this.addLog('Inject TikTok Pixel', this.config.tiktokPixelId, 'TikTok');
      const ttScript = document.createElement('script');
      ttScript.innerHTML = `!function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${this.config.tiktokPixelId}');
        ttq.page();
      }(window, document, 'ttq');`;
      document.head.appendChild(ttScript);
    }

    // Custom Scripts
    if (this.config.customScripts) {
      this.addLog('Inject Custom Scripts', 'Scripts injected', 'Custom');
      const customScriptContainer = document.createElement('div');
      customScriptContainer.innerHTML = this.config.customScripts;
      Array.from(customScriptContainer.querySelectorAll('script')).forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        document.head.appendChild(newScript);
      });
    }
  }

  trackViewItem(product: Product) {
    if (!this.config.isEnabled) return;
    this.addLog('view_item', product.name, 'All');

    // GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category
        }]
      });
    }

    // FB Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'BDT'
      });
    }

    // TikTok
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('ViewContent', {
        contents: [{
          content_id: product.id,
          content_name: product.name,
          content_type: 'product',
          price: product.price,
          quantity: 1
        }],
        value: product.price,
        currency: 'BDT'
      });
    }

    // CAPI ViewContent
    if (this.config.fbCapiToken && this.config.fbPixelId) {
      const payload = {
        data: [{
          event_name: 'ViewContent',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: window.location.href,
          test_event_code: this.config.fbTestEventCode || undefined,
          user_data: {
            client_ip_address: '127.0.0.1',
            client_user_agent: navigator.userAgent,
          },
          custom_data: {
            currency: 'BDT',
            value: product.price,
            content_ids: [product.id],
            content_name: product.name,
            content_type: 'product'
          }
        }]
      };
      console.log('FB CAPI Event: ViewContent', payload);
    }
  }

  trackAddToCart(item: CartItem) {
    if (!this.config.isEnabled) return;
    this.addLog('add_to_cart', item.name, 'All');

    // GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        items: [{
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: item.category
        }]
      });
    }

    // FB Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [item.id],
        content_name: item.name,
        content_type: 'product',
        value: item.price * item.quantity,
        currency: 'BDT'
      });
    }

    // TikTok
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('AddToCart', {
        contents: [{
          content_id: item.id,
          content_name: item.name,
          content_type: 'product',
          price: item.price,
          quantity: item.quantity
        }],
        value: item.price * item.quantity,
        currency: 'BDT'
      });
    }

    // CAPI AddToCart
    if (this.config.fbCapiToken && this.config.fbPixelId) {
      const payload = {
        data: [{
          event_name: 'AddToCart',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: window.location.href,
          test_event_code: this.config.fbTestEventCode || undefined,
          user_data: {
            client_ip_address: '127.0.0.1',
            client_user_agent: navigator.userAgent,
          },
          custom_data: {
            currency: 'BDT',
            value: item.price * item.quantity,
            content_ids: [item.id],
            content_name: item.name,
            content_type: 'product'
          }
        }]
      };
      console.log('FB CAPI Event: AddToCart', payload);
    }
  }

  trackPurchase(orderId: string, total: number, items: CartItem[]) {
    if (!this.config.isEnabled) return;
    this.addLog('purchase', { orderId, total }, 'All');

    // GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderId,
        value: total,
        currency: 'BDT',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: item.category
        }))
      });
    }

    // FB Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        content_ids: items.map(i => i.id),
        content_type: 'product',
        value: total,
        currency: 'BDT'
      });
    }

    // TikTok
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('CompletePayment', {
        contents: items.map(item => ({
          content_id: item.id,
          content_name: item.name,
          content_type: 'product',
          price: item.price,
          quantity: item.quantity
        })),
        value: total,
        currency: 'BDT'
      });
    }

    // Server Side Tracking (CAPI)
    if (this.config.fbCapiToken && this.config.fbPixelId) {
      this.addLog('CAPI Purchase', { orderId, total }, 'CAPI');
      
      // Construct CAPI payload
      const payload = {
        data: [{
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: window.location.href,
          test_event_code: this.config.fbTestEventCode || undefined,
          user_data: {
            client_ip_address: '127.0.0.1', // Should be real IP from server
            client_user_agent: navigator.userAgent,
          },
          custom_data: {
            currency: 'BDT',
            value: total,
            content_ids: items.map(i => i.id),
            content_type: 'product',
            order_id: orderId
          }
        }]
      };

      // In a real app, this should be sent via a server-side proxy to hide the token
      // For now, we'll log the intended call
      console.log('FB CAPI Event: Purchase', payload);
      
      // Optional: Attempt direct call if allowed (usually blocked by CORS if not from server)
      /*
      fetch(`https://graph.facebook.com/v17.0/${this.config.fbPixelId}/events?access_token=${this.config.fbCapiToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error('CAPI Error:', err));
      */
    }
  }
}

export const trackingService = new TrackingService();
