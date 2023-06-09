import React, { forwardRef } from 'react';

export const MapCanvas = forwardRef<HTMLDivElement, Record<string, unknown>>(
	(_, ref) => <div className='map' ref={ref} />
);

MapCanvas.displayName = 'MapCanvas'