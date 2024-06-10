const Footer = () => {
  return (
    <footer className="py-5 text-center bg-white">
      <h2 className="mb-2 text-2xl font-semibold">BlogSphere</h2>
      <p className="text-gray-600">
        &copy; {new Date().getFullYear()} BlogSphere. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
