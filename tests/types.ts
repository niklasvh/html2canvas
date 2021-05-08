export interface PlatformDetails {
    name: string;
    version: string;
}

export interface ScreenshotRequest {
    screenshot: string;
    test: string;
    platform: PlatformDetails;
    devicePixelRatio: number;
    windowWidth: number;
    windowHeight: number;
}
