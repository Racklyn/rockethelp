import { useEffect, useState } from 'react';
import { Text, VStack, useTheme, HStack, ScrollView, Box, useColorModeValue, Image } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { dateFormat } from '../utils/fireStoreDateFormat';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText, Image as ImageIcon} from 'phosphor-react-native';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';


type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
    image?: string;
}

export function Details() {

    const [solution, setSolution] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)

    const navigation = useNavigation()
    const {colors} = useTheme()
    const route = useRoute()

    const { orderId } = route.params as RouteParams

    const bg = useColorModeValue("gray.700", "gray.50")
    const headerBg = useColorModeValue("gray.600", "gray.50")
    const mainBg = useColorModeValue("gray.500", "gray.300")


    function handleOrderClose() {
        if (!solution){
            return Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitação.')
        }

        firestore().collection<OrderFirestoreDTO>('orders').doc(orderId).update(
            {
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            }
        ).then(() => {
            Alert.alert('Solicitação', 'Solicitação encerrada')
            navigation.goBack()
        })
        .catch(error => {
            console.log(error)
            Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação')
        })
    }

    useEffect(() => {
        firestore().collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .get()
        .then((doc) => {
            const { patrimony, description, status, created_at, closed_at, solution, image } = doc.data()

            const closed = closed_at ? dateFormat(closed_at) : null

            setOrder({
                id: doc.id,
                patrimony,
                description,
                status,
                solution,
                when: dateFormat(created_at),
                closed,
                image
            })

            setIsLoading(false)
        })
    }, [])

    if (isLoading){
        return (<Loading/>)
    }

    return (
        <VStack flex={1} bg={bg}>
            <Box px={6} bg={headerBg} >
                <Header title='Solicitação' />
            </Box>
            
            <HStack bg={mainBg} justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                    ? <CircleWavyCheck size={22} color={colors.green[300]} />
                    : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false} >
                <CardDetails
                    title='equipamento'
                    description={`Patrimônio ${order.patrimony}`}
                    icon={DesktopTower}
                />

                <CardDetails
                    title='descrição do problema'
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${order.when}`}
                />

                {
                    order.image && 

                    <CardDetails
                        title='imagem do equipamento'
                        icon={ImageIcon}
                    >
                        <Image
                            source={{uri: order.image}}
                            resizeMode="contain"
                            flex={1}
                            style={{
								aspectRatio: 1,
                            }}
                            alt='Não foi possível carregar a imagem'
                        />
                    </CardDetails>
                }

                <CardDetails
                    title='solução'
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                    mb={20}
                >
                    {
                        order.status === 'open' &&
                        <Input
                            placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            textAlignVertical="top"
                            multiline
                            h={24}
                        />
                    }
                </CardDetails>
            </ScrollView>

            {
                order.status === 'open' &&
                <Button
                    title='Encerrar solicitação'
                    m={5}
                    onPress={handleOrderClose}
                />
            }

        </VStack>
    );
}