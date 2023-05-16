// Registration for new users
// Only accessible if the phone number from the sign-in
// screen does not exist in the database

export default Registration

function Registration() {
	return (
		<div className='card m-3'>
			<h5 className='card-header'>Next.js - Form Validation Example</h5>
			<div className='card-body'>
				<form>
					<div className='form-row'>
						<div className='form-group col'>
							<label>Title</label>
							<select name='title'>
								<option value=''></option>
								<option value='Mr'>Mr</option>
								<option value='Mrs'>Mrs</option>
								<option value='Miss'>Miss</option>
								<option value='Ms'>Ms</option>
							</select>
						</div>
						<div className='form-group col-5'>
							<label>First Name</label>
							<input
								name='firstName'
								type='text'
							/>
						</div>
						<div className='form-group col-5'>
							<label>Last Name</label>
							<input
								name='lastName'
								type='text'
							/>
						</div>
					</div>
					<div className='form-row'>
						<div className='form-group col'>
							<label>Date of Birth</label>
							<input
								name='dob'
								type='date'
							/>
						</div>
						<div className='form-group col'>
							<label>Email</label>
							<input
								name='email'
								type='text'
							/>
						</div>
					</div>
					<div className='form-row'>
						<div className='form-group col'>
							<label>Password</label>
							<input
								name='password'
								type='password'
							/>
						</div>
						<div className='form-group col'>
							<label>Confirm Password</label>
							<input
								name='confirmPassword'
								type='password'
							/>
						</div>
					</div>
					<div className='form-group form-check'>
						<input
							name='acceptTerms'
							type='checkbox'
							id='acceptTerms'
						/>
						<label htmlFor='acceptTerms' className='form-check-label'>
							Accept Terms & Conditions
						</label>
					</div>
					<div className='form-group'>
						<button
							type='submit'
							className='rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
						>
							Register
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
