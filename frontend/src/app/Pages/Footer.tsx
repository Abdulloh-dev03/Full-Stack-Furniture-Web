const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-4 text-sm text-gray-600">
      <hr className="my-5 text-gray-300" />
      &copy; {currentYear} Abdulloh Ortiqov. All rights reserved.
    </footer>
  );
};

export default Footer;
