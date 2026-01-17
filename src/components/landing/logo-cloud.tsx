import React from 'react';

export function LogoCloud() {
    return (
        <div className="w-full py-10 border-b border-border/40 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium text-muted-foreground mb-8">
                    Được hỗ trợ bởi các công nghệ AI hàng đầu thế giới
                </p>
                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">

                    {/* Google Veo */}
                    <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity cursor-default">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Google G Logo */}
                            <path d="M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z" fill="#4285F4" />
                            <path d="M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z" fill="#34A853" />
                            <path d="M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z" fill="#FBBC05" />
                            <path d="M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z" fill="#EA4335" />
                        </svg>
                        <span className="text-xl font-medium tracking-tight text-foreground/90 group-hover:text-foreground transition-colors" style={{ fontFamily: '"Google Sans", "Product Sans", sans-serif' }}>Veo</span>
                    </div>

                    {/* Runway */}
                    <div className="h-7 w-auto text-foreground group hover:text-[#000000] dark:hover:text-white transition-colors hover:opacity-100 cursor-default">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-auto">
                            <path d="M17.86 22.992c-2.669.245-4.887-2.876-6.597-4.454C10.398 24.759 1 24.177 1 17.86V6.15c0-.921.244-1.861.733-2.65C2.635 1.977 4.383.98 6.15 1h11.71c6.316 0 6.918 9.398.677 10.243l2.97 2.951c3.252 3.064.808 8.929-3.646 8.797zm-1.428-3.721c1.842 1.898 4.774-1.034 2.876-2.876l-5.132-5.132H11.3v2.876l4.436 4.436.696.696zM4.12 17.842c-.037 2.632 4.117 2.632 4.06 0V6.132c.038-1.316-1.353-2.35-2.612-1.955-.057.019-.113.037-.15.056-.79.301-1.335 1.09-1.317 1.936v11.673h.02zm13.74-9.68c2.632.037 2.632-4.098 0-4.06h-6.973c.526 1.109.395 2.857.413 4.06h6.56z"></path>
                        </svg>
                    </div>

                    {/* Pika */}
                    <div className="h-8 w-auto text-foreground group hover:text-[#FFCF4D] transition-colors hover:opacity-100 flex items-center gap-1.5 cursor-default">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-auto">
                            <path d="M.661 19.889h8.666c-.14-1.41-1.145-2.955-3.601-4.007v-.104c2.863.88 3.893 2.386 4.312 4.11H20.73l-1.72-1.476C20.017 15.244 24 13.747 24 13.747c-.141-2.541-1.441-4.909-5.787-6.827L8.326 3c.331 4.179 1.811 6.575 5.523 7.163v.102c-2.579-.064-4.368-1.216-5.275-3.588C.698 8.123-1.201 14.156.66 19.889z"></path>
                        </svg>
                        <span className="font-bold text-lg tracking-tight">Pika</span>
                    </div>

                    {/* Kling AI */}
                    <div className="h-8 w-auto text-foreground group hover:text-[#000000] dark:hover:text-white transition-colors hover:opacity-100 flex items-center gap-2 cursor-default">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-auto">
                            <path clipRule="evenodd" d="M5.493 21.234c-1.112-1.451-1.109-4.263-.081-7.459l-4.557-2.63a1.683 1.683 0 01-.85-1.304 1.505 1.505 0 01.08-.622 13.18 13.18 0 011.037-2.255c3.476-6.02 10.916-8.23 16.619-4.938.46.266.82.67 1.081 1.184.785 1.545.685 4.096-.234 6.954l4.557 2.631c.339.196.596.492.736.832a1.53 1.53 0 01.034 1.093 13.146 13.146 0 01-1.037 2.255c-3.476 6.02-10.916 8.23-16.619 4.938a2.6 2.6 0 01-.766-.68zm11.096-6.615c-2.073 3.591-5.808 5.316-8.343 3.852-1.267-.731-1.994-2.122-2.145-3.778-.095-1.035.036-2.173.4-3.32.217-.684.517-1.37.902-2.039l.008-.014c2.073-3.59 5.808-5.315 8.343-3.852.633.366 1.13.895 1.49 1.54.986 1.772.922 4.415-.285 6.914-.111.23-.232.457-.362.683l-.008.014z"></path>
                        </svg>
                        <span className="font-bold text-lg tracking-tight">Kling AI</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
