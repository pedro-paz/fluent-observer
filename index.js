function fluentMutationObserver(element, options) {
  const self =
    this instanceof fluentMutationObserver
      ? this
      : new fluentMutationObserver(element, options);

  options = options || { childNodes: true, childList: true };
  element =
    typeof element === "string" ? document.querySelector(element) : element;

  self.element = element || self.element;

  this.assertChildExist = function (querySelector) {
    const tryResolvePromise = (observer, resolve) => {
      if (!!document.querySelector(querySelector)) {
        setTimeout(() => resolve(self));
        observer.disconnect();
      }
    };

    return new Promise((resolve) => {
      const observer = new MutationObserver(() =>
        tryResolvePromise(observer, resolve)
      );
      tryResolvePromise(observer, resolve);
      observer.observe(element, options);
    });
  };

  this.assertChildDoesntExist = function (querySelector) {
    const tryResolvePromise = (observer, resolve) => {
      if (!document.querySelector(querySelector)) {
        setTimeout(() => resolve(self));
        observer.disconnect();
      }
    };

    return new Promise((resolve) => {
      const observer = new MutationObserver(() =>
        tryResolvePromise(observer, resolve)
      );
      tryResolvePromise(observer, resolve);
      observer.observe(element, options);
    });
  };

  this.assertHasAttribute = function (name, value) {
    const tryResolvePromise = (observer, resolve) => {
      const hasAttributes =
        Array.from(element.querySelector("#nav-access").attributes).filter(
          (attr) => attr.name === attribute
        ).length != 0;

      if (hasAttributes) {
        setTimeout(() => resolve(self));
        observer.disconnect();
      }
    };

    return new Promise((resolve) => {
      const observer = new MutationObserver(() =>
        tryResolvePromise(observer, resolve)
      );
      tryResolvePromise(observer, resolve);
      observer.observe(element, {
        ...options,
        attributes: true,
        attributesOldValue: true,
      });
    });
  };

  return self;
}
