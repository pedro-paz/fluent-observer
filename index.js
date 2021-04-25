function Queue() {
  this.promise = () => {
    return this.p;
  };

  this.add = (fn, ...args) => {
    this.p = this.p.then(() => {
      return fn.call(...args);
    });
  };

  let oldP = this.p;
  this.p = Promise.resolve();
  return oldP;
}

function fluentObserver(element, options) {
  this.queue = new Queue();

  const createObserver = (tryResolve, options) => {
    this.queue.add(() => {
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
    });
    return this;
  };

  const checkClass = (clsName) => {
    return (
      Array.from(self.element.classList).filter(
        (className) => className === clsName
      ).length != 0
    );
  };

  const checkAttribute = (attrName) => {
    return (
      Array.from(self.element.attributes).filter(
        (attr) => attr.name === attrName
      ).length != 0
    );
  };

  this.hasChild = (querySelector) => {
    const tryResolve = () => {
      return !!document.querySelector(querySelector);
    };

    return createObserver(tryResolve, {
      ...options,
      childNodes: true,
      childList: true,
      attributes: true,
      attributesOldValue: true,
    });
  };

  this.notHasChild = (querySelector) => {
    const tryResolve = () => {
      return !document.querySelector(querySelector);
    };

    return createObserver(tryResolve, options);
  };

  this.hasAttribute = (name, value) => {
    const tryResolve = () => {
      return (
        checkAttribute(name) &&
        (!value || (value && self.element.attributes[name]?.value === value))
      );
    };

    return createObserver(tryResolve, {
      ...options,
      attributes: true,
      attributesOldValue: true,
    });
  };

  this.notHasAttribute = (name) => {
    const tryResolve = () => {
      return !checkAttribute(name);
    };

    return createObserver(tryResolve, {
      ...options,
      attributes: true,
      attributesOldValue: true,
    });
  };

  this.hasClass = (name) => {
    const tryResolve = () => checkClass(name);

    return createObserver(tryResolve, {
      ...options,
      attributes: true,
      attributesOldValue: true,
    });
  };

  this.notHasClass = (name) => {
    const tryResolve = () => !checkClass(name);

    return this.createObserver(tryResolve, {
      ...options,
      attributes: true,
      attributesOldValue: true,
    });
  };

  this.thenExecute = (func) => {
    this.queue.add(
      () =>
        new Promise((resolve) => {
          func();
          resolve(self);
        })
    );
    return this;
  };

  const self =
    this instanceof fluentObserver
      ? this
      : new fluentObserver(element, options);

  options = options || { childNodes: true, childList: true };
  options.timeout = isNaN(options.timeout) ? 1000 : options.timeout;

  element =
    typeof element === "string" ? document.querySelector(element) : element;

  self.element = element || self.element;

  return self;
}
