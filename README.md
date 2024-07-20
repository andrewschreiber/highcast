# Highcast

![highcastlogo2](https://github.com/user-attachments/assets/f903480c-7c52-491b-b65f-984d1303f2d1)

Run [Raycast](<[url](https://github.com/raycast/extensions)>) extensions within [Highlight](https://www.highlight.ing/).

## Milestones

- [x] Logo (july 12)
- [x] Run a raycast url scheme from witin Highlight
- [x] Identify Raycast API usage

## Development

`nvm use 20`

`npm i pnpm -g`

`pnpm i`

To get started, run `pnpm dev`. This will start the Next.js app.

Open Highlight, start dev mode, and go to the Local Development app. Hot reloading is enabled.

https://docs.highlight.ing/learn/developers/getting-started

## API Usage

### `@raycast/api`

"ActionPanel": 3570,
"Action": 3561,
"Icon": 3152,
"List": 2983,
"showToast": 2495,
"Toast": 2344,
"getPreferenceValues": 1756,
"Color": 1065,
"Form": 907,
"Detail": 859,
"showHUD": 799,
"useNavigation": 654,
"open": 634,
"LocalStorage": 632,
"Clipboard": 568,
"": 565,
"closeMainWindow": 563,
"environment": 438,
"popToRoot": 391,
"Image": 380,
"LaunchProps": 368,
"confirmAlert": 373,
"Alert": 257,
"LaunchType": 239,
"MenuBarExtra": 194,
"launchCommand": 190,
"openExtensionPreferences": 203,
"Grid": 284,
"Cache": 172,
"Keyboard": 150,
"getSelectedText": 122,
"ToastStyle": 121,
"openCommandPreferences": 129,
"getApplications": 106,
"Application": 102,
"updateCommandMetadata": 74,
"OpenInBrowserAction": 73,
"PopToRootType": 61,
"getSelectedFinderItems": 56,
"OAuth": 49,
"captureException": 48,
"getFrontmostApplication": 45,
"AI": 39,
"clearSearchBar": 34,
"PushAction": 25,
"CopyToClipboardAction": 50,
"showInFinder": 50,
"preferences": 17,
"getLocalStorageItem": 16,
"setLocalStorageItem": 16,
"ImageMask": 11,
"FileSystemItem": 10,
"getDefaultApplication": 9,
"PreferenceValues": 9,
"trash": 9,
"copyTextToClipboard": 8,
"BrowserExtension": 6,
"ImageLike": 6,
"removeLocalStorageItem": 6,
"randomId": 5,
"type LaunchProps": 5,
"ListItem": 4,
"Navigation": 4,
"FormValue": 4,
"clearLocalStorage": 4,
"OpenAction": 4,
"PasteAction": 3,
"getPreferenceValues as \_getPreferenceValues": 3,
"ActionPanelItem": 3,
"KeyEquivalent": 3,
"Icon as RcIcon": 3,
"FileIcon": 3,
"pasteText": 3,
"SubmitFormAction": 19,
"Cache as RaycastCache": 2,
"ListSection": 2,
"Icon as RaycastIcon": 2,
"getPreferenceValues as gp": 2,
"type Keyboard": 2,
"Preferences": 2,
"OpenWithAction": 2,
"Color as Colour": 1,
"Clipboard as RaycastClipboard": 1,
"FormValues": 1,
"type Application": 1,
"open as openBrowser": 1,
"List as RayCastList": 1,
"LaunchProps as RaycastLaunchProps": 1,
"ArgumentsLaunchProps": 1,
"type Form": 1,
"KeyboardShortcut": 1,
"Environment": 1,
"render": 1,
"Toast as RaycastToast": 6,
"AlertActionStyle": 1,
"allLocalStorageItems": 1

### `@raycast/utils`

"useFetch": 452,
"useCachedPromise": 453,
"useCachedState": 343,
"useForm": 259,
"FormValidation": 191,
"usePromise": 191,
"runAppleScript": 132,
"showFailureToast": 130,
"getFavicon": 124,
"MutatePromise": 103,
"getAvatarIcon": 59,
"getProgressIcon": 30,
"withAccessToken": 30,
"useFrecencySorting": 31,
"useExec": 21,
"useSQL": 22,
"OAuthService": 19,
"useAI": 15,
"getAccessToken": 13,
"Response": 9,
"useLocalStorage": 6,
"CachedPromiseOptions": 3,
"WithAccessTokenComponentOrFn": 1,
"useFetch as useRayFetch": 1
