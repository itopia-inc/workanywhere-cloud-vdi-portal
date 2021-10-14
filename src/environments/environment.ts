// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  casRestEndpointRoot: 'https://cas-rest-dev.itopia.com/api/v2/',
  portalAuthPort: 44343,
  brandingConfig: {
    appTitle: 'Cloud VDI Portal',
    appLogo: 'assets/images/cloud_itopia.svg',
    appLoginImage: 'assets/images/only_cloud.png'
  },
  gatewayAddressUrl: '',
  irdp: {
    macUrl: 'https://storage.googleapis.com/rdp-client/macos/rdp_client_setup.pkg',
    winUrl: 'https://storage.googleapis.com/rdp-client/win/rdp_client_setup.msi',
    linuxUrl: 'https://flathub.org/apps/details/com.itopia.client'
  },
  rdp: {
    MacOS: 'https://apps.apple.com/us/app/microsoft-remote-desktop/id1295203466?mt=12',
    iOS: 'https://apps.apple.com/cy/app/microsoft-remote-desktop/id714464092',
    ChromeOS: 'https://play.google.com/store/apps/details?id=com.microsoft.rdc.android'
  },
  urlExcludeFromInterceptor: [
    'https://cas-gcping-xr5bn4omqa-nn.a.run.app',
    'https://cas-gcping-xr5bn4omqa-uc.a.run.app',
    'https://cas-gcping-xr5bn4omqa-uw.a.run.app',
    'https://cas-gcping-xr5bn4omqa-uk.a.run.app',
    'https://cas-gcping-xr5bn4omqa-ue.a.run.app',
    'https://cas-gcping-xr5bn4omqa-rj.a.run.app',
    'https://cas-gcping-xr5bn4omqa-ew.a.run.app',
    'https://cas-gcping-xr5bn4omqa-nw.a.run.app',
    'https://cas-gcping-xr5bn4omqa-ey.a.run.app',
    'https://cas-gcping-xr5bn4omqa-ez.a.run.app',
    'https://cas-gcping-xr5bn4omqa-el.a.run.app',
    'https://cas-gcping-xr5bn4omqa-as.a.run.app',
    'https://cas-gcping-xr5bn4omqa-de.a.run.app',
    'https://cas-gcping-xr5bn4omqa-an.a.run.app',
    'https://cas-gcping-xr5bn4omqa-ts.a.run.app',
    'https://cas-gcping-xr5bn4omqa-lz.a.run.app',
    'https://cas-gcping-xr5bn4omqa-wl.a.run.app',
    'https://cas-gcping-xr5bn4omqa-df.a.run.app',
    'https://cas-gcping-xr5bn4omqa-oa.a.run.app',
    'https://cas-gcping-xr5bn4omqa-dt.a.run.app',
    'https://cas-gcping-xr5bn4omqa-du.a.run.app',
    'https://cas-gcping-xr5bn4omqa-wn.a.run.app',
    'https://cas-gcping-xr5bn4omqa-wm.a.run.app',
    'https://cas-gcping-xr5bn4omqa-et.a.run.app'
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
