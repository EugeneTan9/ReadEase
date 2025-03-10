/**
 * Reports web performance vitals using the web-vitals library.
 * This function dynamically imports the necessary web-vitals metrics 
 * and invokes the provided callback function (`onPerfEntry`) with the results.
 * 
 * Web Vitals included:
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - TTFB (Time to First Byte)
 * 
 * @param {Function} onPerfEntry - A callback function to handle performance metric results.
 */
const reportWebVitals = (onPerfEntry) => {
  // Ensure the callback function is provided and is a valid function before proceeding
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the web-vitals library to avoid unnecessary bundle size increase
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Measure and report key web vitals to the provided callback
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(error => {
      // Log an error if the import fails (useful for debugging in production)
      console.error("Failed to load web-vitals module:", error);
    });
  }
};

export default reportWebVitals;

