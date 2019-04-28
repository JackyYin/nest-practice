export function flash(req, res, next) {
  res.locals.error =req.flash('error');
  res.locals.success =req.flash('success');
  res.locals.info =req.flash('info');
  next();
}
