import 'core-js/es7/reflect';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import { Router } from '@angular/router';

import { AppModule } from './app/app.module';



const spaProps = {
    bootstrappedModule: null,
    Router: Router
};

// This lifecycle function will be called by singleSPA exactly once, right before the registered application is mounted for the first time.
export function bootstrap(props) {
    return Promise.resolve();
}


// This lifecycle function is called by singleSPA every time the route for this app is active and the app should be rendered.
export function mount(props) {
    console.log("mount startng");
    createDomElement();

    return platformBrowserDynamic([
        {provide: 'localStoreRef', useValue: props.customProps.store },
        {provide: 'globalEventDispatcherRef', useValue: props.customProps.globalEventDistributor }])
        .bootstrapModule(AppModule).then(module => {
            return spaProps.bootstrappedModule = module;
        });
}

// This lifecycle function will be called when the user navigates away from this apps route.
export function unmount(props) {
    console.log("unmount startng");
    return new Promise((resolve, reject) => {
        if (spaProps.Router) {
            const routerRef = spaProps.bootstrappedModule.injector.get(spaProps.Router);
            routerRef.dispose();
        }
       // spaProps.bootstrappedModule.destroy();
        //delete spaProps.bootstrappedModule;
        resolve();
    });
}

function createDomElement() {
    // Make sure there is a div for us to render into
    let el = window.document.getElementById('appname');
    if (!el) {
        el = window.document.createElement('appname');
        el.id = 'appname';
        window.document.body.appendChild(el);
    }else{
        let appname = window.document.createElement('appname');
        el.appendChild(appname);
    }

    return el;
}