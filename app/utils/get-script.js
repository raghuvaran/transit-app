export function getScript(url) {
  const promise = new Promise((res, rej) => {
    const tag = 'script';
    const scriptTag = document.createElement(tag); // create a script tag
    const firstScriptTag = document.getElementsByTagName(tag)[0]; // find the first script tag in the document
    scriptTag.src = url; // set the source of the script to your script
    scriptTag.onload=res;
    scriptTag.onerror=rej;
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
  });
  return promise;
}