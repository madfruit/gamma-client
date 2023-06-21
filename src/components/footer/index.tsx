import { ButtonGroup, Container, IconButton, Stack, Text } from '@chakra-ui/react'
import { FaGithub, FaLinkedin, FaTwitter, FaTelegram } from 'react-icons/fa'
import React from "react";

const Index: React.FC = () => (
    <Container as="footer" role="contentinfo" py={{ base: '12', md: '16' }}>
        <Stack spacing={{ base: '4', md: '5' }}>
            <Stack justify="space-between" direction="row" align="center">
                <ButtonGroup variant="tertiary">
                    <IconButton
                        as="a"
                        href="#"
                        aria-label="LinkedIn"
                        icon={<FaLinkedin fontSize="1.25rem" />}
                    />
                    <IconButton as="a" href="#" aria-label="GitHub" icon={<FaGithub fontSize="1.25rem" />} />
                    <IconButton
                        as="a"
                        href="#"
                        aria-label="Twitter"
                        icon={<FaTwitter fontSize="1.25rem" />}
                    />
                    <IconButton
                        as="a"
                        href="https://t.me/gamma_simbad_bot"
                        aria-label="Twitter"
                        icon={<FaTelegram fontSize="1.25rem" />}
                    />
                </ButtonGroup>
            </Stack>
            <Text fontSize="sm" color="fg.subtle">
                У разі виявленні проблем і з питань співправці info.gamma@gmail.com.
            </Text>
            <Text fontSize="sm" color="fg.subtle">
                &copy; {new Date().getFullYear()} Gamma. All rights reserved.
            </Text>
        </Stack>
    </Container>
)

export default Index;
