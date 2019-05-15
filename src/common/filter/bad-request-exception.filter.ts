import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly path: string = 'back') {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

		exception.message.forEach((err) => {
			Object.values(err.constraints).forEach((constraint) => {
				request.flash('error', constraint);
			});
    });

		response.redirect(this.path);
  }
}
