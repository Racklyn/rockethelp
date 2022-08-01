import { Input as NativeBaseInput, IInputProps, useColorModeValue } from 'native-base';   

export function Input({...rest} : IInputProps) {
  return (

    <NativeBaseInput
        bg={useColorModeValue("gray.700", "gray.100")}
        h={14}
        size="md"
        borderWidth={0}
        fontSize="md"
        fontFamily="body"
        color={useColorModeValue("white", "gray.700")}
        placeholderTextColor="gray.300"
        _focus={{
            borderWidth: 1,
            borderColor: "green.500",
            bg: useColorModeValue("gray.700", "gray.100")
        }}
        {...rest  }
    />

  );
}