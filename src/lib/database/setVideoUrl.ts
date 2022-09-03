export const parseURL = (text: string) => {
  if (text.includes("youtube.com/")) {
    const split = text.split(/[=&]/gm);
    return split[1];
  } else if (text.includes("youtu.be/")) {
    const split = text.split(/be\//gm);
    return split[1];
  } else {
    return text;
  }
};

export const setVideoURL = (text: string) => {
  // parse string (youtube url? youtu.be url? id? playlist?)
  // and update state.
  parseURL(text);
};
