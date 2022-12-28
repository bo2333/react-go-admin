
import React, { LazyExoticComponent } from 'react';
import Loading from "../view/loading";

export const LazyComponent = (props: {
    lazyChildren: LazyExoticComponent<() => JSX.Element>, code?: string;
}) => {
    return (
        <React.Suspense fallback={<Loading />}>
            <props.lazyChildren />
        </React.Suspense>
    );
};