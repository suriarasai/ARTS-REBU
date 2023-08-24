// Reusable component for containing inputed data
// Does nothing currently, but if any styling changes
// must be made, this will apply it to everything

interface Props {
	children: React.ReactNode
}

const Section = ({ children }: Props) => (
	/*
		children	: the data to render
	*/
	<section>{children}</section>
)

export default Section
