import { Heading, HStack, IconButton, StyledProps, useTheme, useColorModeValue } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';

type Props = StyledProps & {
    title: string;
}

export function Header({title, ...rest}: Props) {

    const {colors} = useTheme();
    const navigation = useNavigation()

    function handleGoBack() {
        navigation.goBack()
    }

    return (
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg={useColorModeValue("gray.600", "gray.50")}
            pb={6}
            pt={12}
        >
            <IconButton
                icon={<CaretLeft color={useColorModeValue(colors.gray[200],colors.gray[700])} size={24} />}
                onPress={handleGoBack}
            />

            <Heading color={useColorModeValue(colors.gray[100],colors.primary[700])} textAlign="center" fontSize="lg" flex={1} ml={-6} >
                {title}
            </Heading>

        </HStack>
    );
}