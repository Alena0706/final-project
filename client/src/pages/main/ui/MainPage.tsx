import AboutSection from '@/widgets/components/ui/AboutSection'
import AdvantagesCarousel from '@/widgets/components/ui/AdventagesCorusel'
import AdvantagesSection from '@/widgets/components/ui/AdventageSection'
import BrandSection from '@/widgets/components/ui/Brandsection'
import ContactSection from '@/widgets/components/ui/ContactSection'
import GallerySection from '@/widgets/components/ui/GallerySection'
import HeroSection from '@/widgets/components/ui/HeroSection'
import React from 'react'

export default function MainPage(): React.JSX.Element {
  return (
    <>
    <HeroSection />
    <AboutSection />
    <GallerySection />
    <AdvantagesCarousel />
    <AdvantagesSection />
    <BrandSection />
    <ContactSection />
    </>
  )
}
