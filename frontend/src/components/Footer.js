import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  const githubUrl = 'https://github.com/WhaL3S';

  return (
    <footer style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', textAlign: 'center', position: 'fixed', bottom: '0', width: '100%' }}>
      <p>&copy; 2023 WorkIS. All rights reserved.</p>
      <a href={githubUrl}>
        <FaGithub size={24} style={{ margin: '0 5px', color: '#0366d6' }} />
      </a>
    </footer>
  );
};

export default Footer;
