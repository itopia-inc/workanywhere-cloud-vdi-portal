export const environment = {
  production: true,
  casRestEndpointRoot: 'https://cas-rest.itopia.com/api/v2/',
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
    'https://cas-gcping-pwd5xwpcna-nn.a.run.app',
    'https://cas-gcping-pwd5xwpcna-uc.a.run.app',
    'https://cas-gcping-pwd5xwpcna-uw.a.run.app',
    'https://cas-gcping-pwd5xwpcna-uk.a.run.app',
    'https://cas-gcping-pwd5xwpcna-ue.a.run.app',
    'https://cas-gcping-pwd5xwpcna-rj.a.run.app',
    'https://cas-gcping-pwd5xwpcna-ew.a.run.app',
    'https://cas-gcping-pwd5xwpcna-nw.a.run.app',
    'https://cas-gcping-pwd5xwpcna-ey.a.run.app',
    'https://cas-gcping-pwd5xwpcna-ez.a.run.app',
    'https://cas-gcping-pwd5xwpcna-el.a.run.app',
    'https://cas-gcping-pwd5xwpcna-as.a.run.app',
    'https://cas-gcping-pwd5xwpcna-de.a.run.app',
    'https://cas-gcping-pwd5xwpcna-an.a.run.app',
    'https://cas-gcping-pwd5xwpcna-ts.a.run.app',
    'https://cas-gcping-pwd5xwpcna-lz.a.run.app',
    'https://cas-gcping-pwd5xwpcna-wl.a.run.app',
    'https://cas-gcping-pwd5xwpcna-df.a.run.app',
    'https://cas-gcping-pwd5xwpcna-oa.a.run.app',
    'https://cas-gcping-pwd5xwpcna-dt.a.run.app',
    'https://cas-gcping-pwd5xwpcna-du.a.run.app',
    'https://cas-gcping-pwd5xwpcna-wn.a.run.app',
    'https://cas-gcping-pwd5xwpcna-wm.a.run.app',
    'https://cas-gcping-pwd5xwpcna-et.a.run.app'
  ]
};
