export type DevicesViewType = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
};

export type DeviceCreateDto = {
    issuedAt: string;
    deviceId: string;
    deviceName: string;
    IP: string;
    userId: string;
};
