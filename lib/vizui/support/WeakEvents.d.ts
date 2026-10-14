export declare class WeakEvents<EventMap extends WeakEvents.EventMap = WeakEvents.EventMap> implements WeakEvents.Public<EventMap> {
    protected vGCN: FinalizationRegistry<WeakEvents.GCNEntry>;
    protected vStorage: WeakEvents.ListenerMap<EventMap>;
    protected vOnces: Set<WeakRef<WeakEvents.Listener<any>>>;
    constructor();
    get public(): WeakEvents.Public<EventMap>;
    on<E extends string & keyof EventMap>(name: E, listener: WeakEvents.Listener<EventMap[E]>): WeakEvents.off;
    once<E extends string & keyof EventMap>(name: E, listener: WeakEvents.Listener<EventMap[E]>): WeakEvents.off;
    clear(): void;
    emit<E extends string & keyof EventMap>(name: E, ...args: EventMap[E]): void;
}
export declare namespace WeakEvents {
    interface EventMap {
        [name: string]: [...args: any[]];
    }
    type off = () => void;
    type Listener<T extends any[]> = (...args: T) => void;
    type ListenerMap<eventMap extends EventMap> = {
        [name in keyof eventMap]?: Set<WeakRef<Listener<eventMap[name]>>>;
    };
    interface Public<eventMap extends EventMap> {
        on<E extends string & keyof eventMap>(name: E, listener: Listener<eventMap[E]>): off;
        once<E extends string & keyof eventMap>(name: E, listener: Listener<eventMap[E]>): off;
    }
    interface GCNEntry {
        name: string;
        listener: WeakRef<Listener<any>>;
    }
}
