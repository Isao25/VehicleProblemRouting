import React, { useState, useEffect } from 'react';
import logoClaro from '@assets/logo-blanco.png';
import logoOscuro from '@assets/logo-oscuro.png';
import Switch from 'react-switch';

export const Header = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
        if (storedTheme === "dark") {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const handleChangeTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    };

    return (
        <header className='sticky top-0 z-50 shadow bg-white  dark:bg-black'>
            <div className='flex items-center justify-between flex-wrap lg:px-24 lg:h-20 sm:h-12 sm:px-3'>
                <div className="flex">
                    <a className="-m-1.5 p-1.5">
                        <img 
                            className="lg:h-16 sm:h-10 w-auto cursor-pointer" 
                            src={theme === 'dark' ? logoOscuro : logoClaro} 
                            alt="Logo" 
                        />
                    </a>
                </div>
                <div className="flex items-center">
                    <span className="mr-2 text-gray-600 dark:text-gray-300">Light</span>
                    <Switch 
                        onChange={handleChangeTheme}
                        checked={theme === 'dark'}
                        offColor="#bbb"
                        onColor="#000"
                        offHandleColor="#fff"
                        onHandleColor="#fff"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Dark</span>
                </div>
            </div>
        </header>
    );
};
