import React from 'react';
import {Center, HStack, PinInput, Button} from '@chakra-ui/react';

type PaginateProps = {
    items: any[];
    onPageClick: Function;
}

const Paginator: React.FC<PaginateProps> = (props) => {
    const {items, onPageClick} = props;
    const pinValues = '123456789';
    let pageCounter = 0;
    return (
        <Center mt={20}>
            <HStack>
                <PinInput size='sm' defaultValue={pinValues}>
                    {items.map((item, index) => {
                        if((index -1) % 20 === 0) {
                            pageCounter++;
                            return <Button key={`page${index}`} onClick={onPageClick(pageCounter)}>{pageCounter}</Button>
                        }
                    })}
                </PinInput>
            </HStack>
        </Center>
    );
};

export default Paginator;
