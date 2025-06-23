'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { menuSlide } from '../animation';
import MenuLink from './Link/Link';
import Curve from './Curve/Curve';
import Footer from './Footer/footer';
import { RiCloseLargeLine } from 'react-icons/ri';
import RoundedButton from '../../common/RoundedButton/RoundedButton';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '../../../redux/app/hook';

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Products', href: '/products' },
  { title: 'Rooms', href: '/rooms' },
  { title: 'Cart', href: '/cart' },
];

export default function Menu({
  onCloseAction,
  isClosing,
}: {
  onCloseAction: () => void;
  isClosing: boolean;
}) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
    setSelectedIndicator(pathname);
  }, [pathname]);

  // Prevent background scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      {/* 🔥 Backdrop */}
      <div
        className="fixed inset-0  z-20"
        onClick={() => {
          if (!isClosing) onCloseAction();
        }}
      ></div>

      {/* 🔒 Menu Panel */}
      <motion.div
        variants={menuSlide}
        initial="initial"
        animate="enter"
        exit="exit"
        className="fixed right-0 top-0 z-30 h-screen w-[500px] bg-[#1c1d20] text-white max-md:w-full"
        key="menu"
      >
        {/* ❌ Close Button */}
        <RoundedButton
          onClick={() => {
            if (!isClosing) onCloseAction();
          }}
          className="absolute top-6 right-[-25vw] text-white text-xl bg-[#455ce9] px-7 py-7 rounded-full max-md:px-6 max-md:py-6 max-sm:right-[-75vw] max-md:right-[-80vw] max-xl:right-[-40vw]"
        >
          <RiCloseLargeLine className="text-2xl" />
        </RoundedButton>

        {/* 🧑 User Greeting */}
        {user && (
          <div className="text-white text-xl font-semibold px-18">
            Hello, {user.name || user.email || 'User'}!
          </div>
        )}

        {/* 📌 Navigation */}
        <div className="flex flex-col justify-between p-18 h-full max-sm:p-12">
          <nav
            onMouseLeave={() => setSelectedIndicator(window.location.pathname)}
            className="flex flex-col gap-5 text-5xl font-light max-md:mt-5"
          >
            <div className="mb-10 border-b border-gray-400 pb-2 text-xs uppercase text-gray-400">
              Navigation
            </div>
            {navItems.map((data, index) => (
              <MenuLink
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator === data.href}
                setSelectedIndicator={setSelectedIndicator}
                onClose={onCloseAction}
              />
            ))}
          </nav>
          <Footer onCloseAction={onCloseAction} />
        </div>

        <Curve />
      </motion.div>
    </>
  );
}
