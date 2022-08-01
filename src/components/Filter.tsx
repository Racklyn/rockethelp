import { Text, Button, IButtonProps, useTheme, useColorModeValue } from 'native-base';

type Props = IButtonProps & {
    title: string;
    isActive?: boolean; //opcional
    type: 'open' | 'closed'; //algumas das duas opções
}

export function Filter({ title, isActive = false, type, ...rest }: Props) {

    const {colors} = useTheme()

    const colorType = type === 'open' ? colors.secondary[700] : colors.green[400]

    const textColor = useColorModeValue(colorType, "white")

    return (
        <Button
            variant="outline"
            borderWidth={isActive ? 1 : 0}
            borderColor={colorType}
            bgColor={useColorModeValue("gray.600", isActive ? colorType : "gray.50")}
            flex={1}
            size="sm"
            {...rest}
        >
            <Text
                color={isActive ? textColor : "gray.300"}
                fontSize="xs"
                textTransform="uppercase"
                fontWeight={useColorModeValue("normal", "bold")}>
                {title}
            </Text>
        </Button>
    );
}