export const findNestedHtmlChild = (
  children: HTMLCollection,
  className: string
): Element | null => {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.classList.contains(className)) {
      return child;
    }
    if (child.children.length > 0) {
      const nestedChild = findNestedHtmlChild(child.children, className);
      if (nestedChild) {
        return nestedChild;
      }
    }
  }
  return null;
};
