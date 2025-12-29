export function LivePreview({ code }: { code: string }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: { extend: { colors: { background: '#0f0f0f' } } }
          }
        </script>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      </head>
      <body class="bg-background text-white h-screen overflow-hidden">
        <div id="root" class="h-full"></div>
        <script type="text/babel">
          // Expose hooks globally so "useState" works without imports
          const { useState, useEffect, useRef, useMemo, useCallback } = React;
          
          ${code}
          const root = ReactDOM.createRoot(document.getElementById('root'));
          
          // Basic error boundary
          class ErrorBoundary extends React.Component {
            constructor(props) {
              super(props);
              this.state = { hasError: false, error: null };
            }
            static getDerivedStateFromError(error) {
              return { hasError: true, error };
            }
            render() {
              if (this.state.hasError) {
                return (
                  <div className="p-4 text-red-400 bg-red-900/20 h-full flex flex-col items-center justify-center">
                    <h2 className="font-bold mb-2">Preview Error</h2>
                    <pre className="text-xs whitespace-pre-wrap">{this.state.error.message}</pre>
                  </div>
                );
              }
              return this.props.children;
            }
          }

          try {
            // Check if App is defined
            if (typeof App !== 'undefined') {
                root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));
            } else {
                root.render(<div className="p-8 text-gray-500 text-center">Waiting for component...</div>);
            }
          } catch (e) {
            root.render(<div className="text-red-500">{e.message}</div>);
          }
        </script>
      </body>
    </html>
  `;

  return <iframe srcDoc={html} className="w-full h-full border-none bg-black" title="preview" />;
}
