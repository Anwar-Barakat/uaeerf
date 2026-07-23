export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-white">
                <img
                    src="/images/logo.jpeg"
                    alt="UAEERF"
                    className="size-full object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="truncate text-sm leading-tight font-semibold">
                    UAEERF
                </span>
                <span className="truncate text-xs leading-tight text-sidebar-foreground/60">
                    Equestrian Federation
                </span>
            </div>
        </>
    );
}
