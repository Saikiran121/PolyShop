use Mojolicious::Lite -signatures;

# Mock Database
my $reviews = [
  { productId => '1', user => 'Alice', rating => 5, comment => 'Great laptop!' },
  { productId => '2', user => 'Bob', rating => 4, comment => 'Good sound.' }
];

# Get reviews for a product
get '/reviews/:productId' => sub ($c) {
  my $productId = $c->param('productId');
  my @product_reviews = grep { $_->{productId} eq $productId } @$reviews;
  $c->render(json => \@product_reviews);
};

# Add a review
post '/reviews' => sub ($c) {
  my $new_review = $c->req->json;
  push @$reviews, $new_review;
  $c->render(json => { status => 'added', review => $new_review }, status => 201);
};

app->start;
