import { useEffect, useState } from "react";
import {StatusBar, useColorModeValue, useColorMode} from 'native-base';
import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes";
import { Loading } from "../components/Loading";

export function Routes(){

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<FirebaseAuthTypes.User>()

    const { setColorMode } = useColorMode()

    const statusBarStyle = useColorModeValue('light-content', 'dark-content')

    useEffect(()=>{
        const subscriber = auth().onAuthStateChanged(response => {
            setUser(response)
            setIsLoading(false)
        })

        return subscriber
    },[])


    if (isLoading){
        return <Loading/>
    }


    return (
        <NavigationContainer>
            <StatusBar
				barStyle={statusBarStyle}
				backgroundColor="transparent"
				translucent
			/>
            {user ? <AppRoutes /> : <SignIn /> }
        </NavigationContainer>
    )
}