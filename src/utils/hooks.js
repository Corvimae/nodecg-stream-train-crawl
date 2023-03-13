import { useState, useEffect, useRef } from 'react';
import { clone } from 'lodash';

// from https://github.com/Hoishin/use-nodecg/blob/master/src/use-replicant.ts
export const useReplicant = (replicantName, initialValue, options, onChange) => {
	const [value, updateValue] = useState(initialValue);
	const onChangeHandler = useRef(null);
	const replicantOptions = options && {
		defaultValue: options.defaultValue,
		persistent: options.persistent,
		schemaPath: options.schemaPath,
	};
	
	if (onChange) onChangeHandler.current = onChange;

	const replicant = options && options.namespace ? nodecg.Replicant(
    replicantName,
    options.namespace,
    replicantOptions,
  ) : nodecg.Replicant(replicantName, replicantOptions);

	const changeHandler = (newValue) => {
		if (newValue === undefined) return;
			
		onChangeHandler.current?.(newValue);

		updateValue((oldValue) => {
			if (newValue !== oldValue) {
				return newValue;
			}

			// replicant.value has always the same reference. Cloning to cause re-rendering
			return clone(newValue);
		});
	};

	useEffect(() => {
		replicant.on('change', changeHandler);

		return () => {
			replicant.removeListener('change', changeHandler);
		};
	}, [replicant]);

	return [
		value,
		(newValue) => {
			replicant.value = newValue;
		},
	];
};