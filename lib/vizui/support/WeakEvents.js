export class WeakEvents {
    vGCN;
    vStorage;
    vOnces;
    constructor() {
        this.vGCN = new FinalizationRegistry((entry) => {
            const listeners = this.vStorage[entry.name];
            if (!listeners)
                return;
            listeners.delete(entry.listener);
            this.vOnces.delete(entry.listener);
            if (listeners.size === 0)
                delete this.vStorage[entry.name];
        });
        this.vStorage = {};
        this.vOnces = new Set();
    }
    get public() { return this; }
    on(name, listener) {
        const ref = new WeakRef(listener);
        const listeners = this.vStorage[name] ?? (this.vStorage[name] = new Set());
        this.vGCN.register(listener, { name, listener: ref }, ref);
        listeners.add(ref);
        return () => {
            listeners.delete(ref);
            this.vGCN.unregister(ref);
            if (listeners.size === 0)
                delete this.vStorage[name];
        };
    }
    once(name, listener) {
        const ref = new WeakRef(listener);
        this.vGCN.register(listener, { name, listener: ref }, ref);
        const listeners = this.vStorage[name] ?? (this.vStorage[name] = new Set());
        this.vOnces.add(ref);
        listeners.add(ref);
        return () => {
            this.vGCN.unregister(ref);
            this.vOnces.delete(ref);
            listeners.delete(ref);
            if (listeners.size === 0)
                delete this.vStorage[name];
        };
    }
    clear() {
        for (const name in this.vStorage) {
            const listeners = this.vStorage[name];
            if (!listeners)
                continue;
            for (const ref of listeners) {
                this.vGCN.unregister(ref);
            }
        }
        this.vStorage = {};
        this.vOnces.clear();
    }
    emit(name, ...args) {
        const listeners = this.vStorage[name];
        if (!listeners)
            return;
        for (const ref of listeners) {
            const listener = ref.deref();
            if (!listener) {
                listeners.delete(ref);
                continue;
            }
            try {
                listener(...args);
            }
            finally {
                if (this.vOnces.has(ref)) {
                    listeners.delete(ref);
                    this.vOnces.delete(ref);
                }
            }
        }
    }
}
//# sourceMappingURL=WeakEvents.js.map