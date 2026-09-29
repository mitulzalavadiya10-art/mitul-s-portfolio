const SocialConnect = () => {
  
  return (
    <div className="bg-transparent flex flex-col items-center justify-center p-4 font-sans w-full py-12 md:py-16">
      <div className="w-full max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-6 ">
          Connect <span className="text-white">With Mitul</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Follow me across platforms for Shopify tutorials, app updates, development insights, and behind-the-scenes content
        </p>
      </div>
      
      <div className="relative w-full max-w-2xl">
        {/* 3D Glowing Container */}
        <div 
          className={`rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-3xl overflow-hidden p-8 transition-all duration-500 hover:scale-105`}
          style={{
            boxShadow: '0 0 50px rgba(255, 255, 255, 0.05), 0 0 80px rgba(255, 255, 255, 0.02)'
          }}
        >
          <div className="flex flex-wrap justify-center gap-8">
            <a href="https://youtube.com/@ai-section-hub?si=Rop3U0a3xRipzLpX" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
              <div className="icon-container">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  ></path>
                </svg>
              </div>
              <span className="icon-label">YouTube</span>
            </a>

            <a href="https://www.linkedin.com/in/mitul-zalavadiya-784873369?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
              <div className="icon-container">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  ></path>
                </svg>
              </div>
              <span className="icon-label">LinkedIn</span>
            </a>

            <a href="https://www.instagram.com/_mitulzalavadiya_" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <div className="icon-container">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
                  ></path>
                </svg>
              </div>
              <span className="icon-label">Instagram</span>
            </a>

            <a href="https://x.com/mitul1125" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
              <div className="icon-container">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  ></path>
                </svg>
              </div>
              <span className="icon-label">X</span>
            </a>

            <a href="https://www.reddit.com/user/mitulzalavadiya1125/" target="_blank" rel="noopener noreferrer" className="social-icon reddit">
              <div className="icon-container">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.35-4.24 3.71.79c.05.89.79 1.6 1.69 1.6 1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8c-.81 0-1.5.54-1.72 1.28l-3.97-.85c-.2-.04-.4.07-.46.27l-1.5 4.73c-2.49.04-4.75.68-6.42 1.7C3.36 9.79 2.46 9.3 1.5 9.3c-1.65 0-3 1.35-3 3 0 1.13.63 2.11 1.56 2.62-.06.29-.1.59-.1.88 0 3.69 4.19 6.7 9.35 6.7s9.35-3 9.35-6.7c0-.29-.04-.59-.1-.88.94-.51 1.56-1.5 1.56-2.62zm-18 2.71c0-1 1-1.8 1.8-1.8s1.8.8 1.8 1.8-1 1.8-1.8 1.8-1.8-.8-1.8-1.8zm7.55 3.32c-1.02 1.02-2.97 1.09-3.55 1.09-.59 0-2.54-.07-3.56-1.09-.19-.19-.19-.51 0-.7.19-.19.51-.19.7 0 .8.8 2.29.87 2.86.87.56 0 2.05-.07 2.85-.86.19-.19.51-.19.7 0 .2.19.2.51.01.7zm-.51-1.52c-.8 0-1.8-.8-1.8-1.8s1-1.8 1.8-1.8 1.8.8 1.8 1.8-1 1.8-1.8 1.8z"
                  ></path>
                </svg>
              </div>
              <span className="icon-label">Reddit</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Inline style for hover animations and shake keyframes */}
      <style>{`
        .social-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .icon-container {
          display: inline-flex;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          transition: all 0.3s ease;
          position: relative;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .social-icon:hover .icon-container {
          transform: translateY(-10px) scale(1.1);
        }
        
        .social-icon:hover .icon-label {
          opacity: 1;
          transform: translateY(5px);
        }
        
        .icon-label {
          margin-top: 12px;
          color: white;
          font-weight: 500;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        
        .social-icon.youtube:hover .icon-container {
          background: #FF0000;
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.5);
        }
        
        .social-icon.linkedin:hover .icon-container {
          background: #0077B5;
          box-shadow: 0 0 25px rgba(0, 119, 181, 0.5);
        }
        
        .social-icon.instagram:hover .icon-container {
          background: #d62976;
          box-shadow: 0 0 25px rgba(214, 41, 118, 0.5);
        }
        
        .social-icon.twitter:hover .icon-container {
          background: #111111;
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .social-icon.reddit:hover .icon-container {
          background: #FF4500;
          box-shadow: 0 0 25px rgba(255, 69, 0, 0.5);
        }
        
        .social-icon:hover svg {
          color: #ffffff !important;
          animation: shake 0.5s;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          20% { transform: translateX(-5px) rotate(-5deg); }
          40% { transform: translateX(5px) rotate(5deg); }
          60% { transform: translateX(-5px) rotate(-5deg); }
          80% { transform: translateX(5px) rotate(5deg); }
        }
        
        .icon-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .social-icon:hover .icon-container::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export { SocialConnect };
