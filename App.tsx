import { NativeBaseProvider, StorageManager, ColorMode} from 'native-base';
import {useFonts, Roboto_400Regular, Roboto_700Bold} from "@expo-google-fonts/roboto";

import { THEME } from './src/styles/theme';

import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() { 

	const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold})

	const colorModeManager: StorageManager = {
		get: async () => {
		  try {
			let val = await AsyncStorage.getItem('@color-mode');
			return val === 'dark' ? 'dark' : 'light';
		  } catch (e) {
			return 'light';
		  }
		},
		set: async (value: ColorMode) => {
		  try {
			await AsyncStorage.setItem('@color-mode', value);
		  } catch (e) {
			console.log(e);
		  }
		},
	  };

	return (
		<NativeBaseProvider theme={THEME} colorModeManager={colorModeManager} >
				{ fontsLoaded ? <Routes /> : <Loading />}
		</NativeBaseProvider>

	);
}

