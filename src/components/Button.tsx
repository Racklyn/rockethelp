import { Button as ButtonNativeBase, Heading, IButtonProps, useColorModeValue} from 'native-base';

type Props = IButtonProps & {
    title: string;
}

export function Button({title, ...rest} : Props) {
  return (
    <ButtonNativeBase
        bg={useColorModeValue("green.700", "primary.800")}
        h={14}
        fontSize="sm"
        rounded="sm"
        _pressed={{ bg: useColorModeValue("green.500", "primary.700")}} 
        {...rest} //Todo o restrante das propriedade (props de IButtonProps)
    >
        <Heading color="white" fontSize="sm">
            {title}
        </Heading>
    </ButtonNativeBase>
  );
}