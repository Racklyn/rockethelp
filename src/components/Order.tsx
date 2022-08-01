import { HStack, Text, Box, useTheme, VStack, Circle, Pressable, IPressableProps, useColorModeValue } from 'native-base';
import { ClockAfternoon, Hourglass, CircleWavyCheck } from 'phosphor-react-native';

export type OrderProps = {
    id: string;
    patrimony: string;
    when: string;
    status: 'open' | 'closed';
}

type Props = IPressableProps & {
    data: OrderProps;

}


export function Order({ data, ...rest }: Props) {

    const { colors } = useTheme();

    const statusColor = data.status === 'open' ? colors.secondary[700] : colors.green[400]


    return (
        <Pressable {...rest}>
            <HStack
                bg={useColorModeValue("gray.600", "gray.100")}
                mb={4}
                alignItems="center"
                justifyContent="space-between"
                rounded="sm"
                overflow="hidden"

            >
                <Box h="full" w={2} bg={statusColor} />
                <VStack flex={1} my={5} ml={5} >
                    <Text color={useColorModeValue("white", "gray.600")} fontSize="md">
                        Patrimônio {data.patrimony}
                    </Text>

                    <HStack alignItems="center">
                        <ClockAfternoon size={15} color={useColorModeValue(colors.gray[300], colors.gray[400])} />
                        <Text color={useColorModeValue("gray.200","gray.300")} fontSize="xs" ml={1} >
                            {data.when}
                        </Text>
                    </HStack>

                </VStack>

                <Circle bg={useColorModeValue("gray.500", statusColor)} h={12} w={12} mr={5}>
                    {
                        data.status === 'closed'
                            ? <CircleWavyCheck size={24} color={useColorModeValue(statusColor, "white")} />
                            : <Hourglass size={24} color={useColorModeValue(statusColor, "white")} />
                    }
                </Circle>

            </HStack>
        </Pressable>
    );
}