function fluentMutationObserver(element, options) {
  const self =
    this instanceof fluentMutationObserver
      ? this
      : new fluentMutationObserver(element, options);

  options = options || { childNodes: true, childList: true };
  element =
    typeof element === "string" ? document.querySelector(element) : element;

  self.element = element || self.element;

  this.createObserver = function (tryResolve, options) {
    return new Promise((resolve) => {
      const onSuccess = (observer, resolve) => {
        setTimeout(() => resolve(self));
        observer.disconnect();
      };

      const observer = new MutationObserver(() => {
        tryResolve() && onSuccess(observer, resolve);
      });

      if (tryResolve()) {
        onSuccess(observer, resolve);
        return;
      }

      observer.observe(element, options);
    });
  };

  this.assertChildExist = (querySelector) => {
    const tryResolve = () => {
      return !!document.querySelector(querySelector);
    };

    return this.createObserver(tryResolve, options);
  };

  this.assertChildDoesntExist = (querySelector) => {
    const tryResolve = () => {
      return !document.querySelector(querySelector);
    };

    return this.createObserver(tryResolve, options);
  };

  this.assertHasAttribute = (name, value) => {
    const tryResolve = () => {
      const hasAttribute =
        Array.from(self.element.attributes).filter((attr) => attr.name === name)
          .length != 0;

      return (
        hasAttribute &&
        (!value || (value && self.element.attributes[name] === value))
      );
    };

    return this.createObserver(tryResolve, {
      ...options,
      attributes: true,
      attributesOldValue: true,
    });
  };

  this.assertHasClass = (name) => {
    const tryResolve = () => {
      return (
        Array.from(self.classList).filter((className) => className === name)
          .length != 0
      );
    };

    return this.createObserver(tryResolve, {
      ...options,
      attributes: true,
      attributesOldValue: true,
    });
  };

  return self;
}
