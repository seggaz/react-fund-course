import { useState } from "react";

export const useFething = (callback) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const fething = async (...args) => {
		try {
			setIsLoading(true)
			await callback(...args)
		} catch (e) {
			setError(e.message);
		} finally {
			setIsLoading(false)
		}
	}

	return [fething, isLoading, error]
}