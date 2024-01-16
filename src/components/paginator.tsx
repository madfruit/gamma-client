import React, {useState} from 'react';
import {Center, HStack, PinInput, Button, IconButton} from '@chakra-ui/react';
import {ArrowLeftIcon, ArrowRightIcon} from '@chakra-ui/icons';

type PaginateProps = {
    render: Function;
}

const Paginator: React.FC<PaginateProps> = (props) => {
    const {render} = props;
    const [pageNumber, setPageNumber] = useState(1);

    const decrementPageNumber = () => {
        if(pageNumber !== 1) {
            const updateNumber = render(Number(pageNumber) - 1);
            updateNumber && setPageNumber(Number(pageNumber) - 1);
        }
    }

    const incrementPageNumber = () => {
        const updateNumber = render(Number(pageNumber) + 1);
        updateNumber && setPageNumber(Number(pageNumber) + 1);
    }

    return (
        <Center mt={20}>
            <HStack>
                <IconButton
                    size="md"
                    fontSize="lg"
                    variant="ghost"
                    color="current"
                    marginLeft="2"
                    onClick={decrementPageNumber}
                    icon={<ArrowLeftIcon />}
                    aria-label={`Page down`}
                    />
                <IconButton
                    size="md"
                    fontSize="lg"
                    variant="ghost"
                    color="current"
                    marginLeft="2"
                    onClick={incrementPageNumber}
                    icon={<ArrowRightIcon />}
                    aria-label={`Page down`}
                />
            </HStack>
        </Center>
    );
};

export default Paginator;
