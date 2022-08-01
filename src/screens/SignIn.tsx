import { useState } from "react"
import { Alert } from "react-native"
import auth from '@react-native-firebase/auth'
import { VStack, Heading, Icon, useTheme, useColorModeValue } from "native-base"
import { Envelope, Key } from "phosphor-react-native"

import Logo from '../assets/logo_primary.svg'

import { Button } from "../components/Button"
import { Input } from "../components/Input"

export function SignIn(){

    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSignIn(){

        if(!email || !password){
            return Alert.alert('Entrar', 'Informe e-mail e senha.')
        }
        setIsLoading(true)

        auth().signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.log(error)
                setIsLoading(false)

                if (error.code === 'auth/invalid-email'){
                    return Alert.alert('Entrar', 'Formato de e-mail inválido.')
                }

                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'){
                    return Alert.alert('Entrar', 'E-mail ou senha inválida.')
                }

                return Alert.alert('Entrar', 'Não foi possível acessar.')

            })

    }

    const { colors } = useTheme()

    return (
        <VStack flex={1} alignItems="center" bg={useColorModeValue("gray.600", "gray.50")} px={8} pt={24}>

            <Logo/>

            <Heading color={useColorModeValue("gray.100", "gray.300")} fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={ <Envelope color={colors.gray[300]} /> } ml={4} />}
                onChangeText={setEmail}
            />
            <Input
                placeholder="Senha"
                mb={8}
                InputLeftElement={<Icon as={ <Key color={colors.gray[300]} /> } ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
                onPress={handleSignIn}
                isLoading={isLoading}
            />

        </VStack>
    )
}