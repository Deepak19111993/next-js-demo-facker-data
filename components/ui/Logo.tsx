export const Logo = ({ className = "" }: { className?: string }) => {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Logo"
        >
            <rect width="48" height="48" rx="12" className="fill-blue-900" />
            <path
                d="M34 16H24.5C22.0147 16 20 18.0147 20 20.5C20 22.9853 22.0147 25 24.5 25H34V29.5C34 31.9853 31.9853 34 29.5 34H14"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw"
            />
            <path
                d="M14 34V16"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw"
            />
        </svg>
    );
};
