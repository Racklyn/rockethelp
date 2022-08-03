import { ReactNode } from 'react';
import { IconProps } from 'phosphor-react-native';
import { VStack, HStack, Text, Box, useTheme, useColorModeValue, IBoxProps } from 'native-base';

type Props = IBoxProps & {
    title: string;
    description?: string;
    footer?: string;
    icon: React.ElementType<IconProps>;
    children?: ReactNode;
}

export function CardDetails({
    title,
    description,
    footer = null,
    icon: Icon, //Renomeando icon as Icon
    children,
    ...rest
}: Props) {

    const {colors} = useTheme()

    const descColor = useColorModeValue("gray.100", "gray.300")
    const footerColor = useColorModeValue("gray.300", "white")

    return (
        <VStack bg={useColorModeValue("gray.600", "gray.200")} p={5} mt={5} rounded="sm" {...rest}>
            <HStack alignItems="center" mb={4}>
                <Icon color={useColorModeValue(colors.primary[700], colors.primary[800])} />
                <Text ml={2} color={useColorModeValue("gray.300", "gray.400")} fontSize="sm" textTransform="uppercase" >
                    {title}
                </Text>
            </HStack>

            {
                !!description && //se description existir:
                <Text color={descColor} fontSize="md">
                    {description}
                </Text>
            }

            {children}

            {
                !!footer &&
                <Box borderTopWidth={1} borderTopColor="gray.400" mt={3} >
                    <Text color={footerColor} fontSize="sm">
                        {footer}
                    </Text>
                </Box>
            }

        </VStack>
    );
}